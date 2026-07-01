import axios from "axios";
import { useAuthStore } from "../../features/auth/store/useAuthStore";

const AUTH_STORAGE_KEY = "auth-storage";

const getTokenFromStorage = () => {
    const persisted = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!persisted) {
        return null;
    }

    try {
        const parsed = JSON.parse(persisted);
        return parsed?.state?.token ?? null;
    } catch {
        return null;
    }
};

const getRequestToken = () => useAuthStore.getState().token || getTokenFromStorage();

const axiosAuth = axios.create({
    baseURL: import.meta.env.VITE_AUTH_URL,
    timeout: 8000,
    headers: {
        "Content-Type": "application/json"
    }
})

const axiosAdmin = axios.create({
    baseURL: import.meta.env.VITE_ADMIN_URL,
    timeout: 10000,
    headers: {
        "Content-Type": undefined
    }
})


axiosAuth.interceptors.request.use((config) => {
    config._axiosClient = "auth";
    const token = getRequestToken();
    // Debug log temporal: indicar si hay token al hacer la request
    try {
        // Mostrar solamente presencia y primeros 8 caracteres para seguridad
        const short = token ? token.slice(0, 8) + '...' : null;
        // eslint-disable-next-line no-console
        console.log('[API][auth][request]', { url: config.url, client: config._axiosClient, hasToken: !!token, tokenPreview: short });
    } catch (e) {}
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        config.headers['x-token'] = token;
    }

    if (typeof FormData !== 'undefined' && config.data instanceof FormData) {
        if (config.headers && typeof config.headers.delete === 'function') {
            config.headers.delete('Content-Type');
        } else {
            delete config.headers['Content-Type'];
        }
    }

    return config;
})

axiosAdmin.interceptors.request.use((config) => {
    config._axiosClient = "admin";
    const token = getRequestToken();
    // Debug log temporal: indicar si hay token al hacer la request
    try {
        const short = token ? token.slice(0, 8) + '...' : null;
        // eslint-disable-next-line no-console
        console.log('[API][admin][request]', { url: config.url, client: config._axiosClient, hasToken: !!token, tokenPreview: short });
    } catch (e) {}
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        config.headers['x-token'] = token;
    }

    // If sending FormData, opt out of Content-Type so browser sets multipart boundary
    if (typeof FormData !== 'undefined' && config.data instanceof FormData) {
        // Use AxiosHeaders.delete if available
        if (config.headers && typeof config.headers.delete === 'function') {
            config.headers.delete('Content-Type');
        } else {
            delete config.headers['Content-Type'];
        }
        // Explicitly set to false — AxiosHeaders special value meaning "don't send this header"
        config.headers['Content-Type'] = false;
        // eslint-disable-next-line no-console
        console.log('[API][admin][request] FormData detected. Content-Type set to false.');
    }

    return config;
})

let _isRefreshing = false;
let failedQueue = [];

function _processQueue(_error, token = null) {
    failedQueue.forEach(({ resolve, reject }) =>
        _error ? reject(_error) : resolve(token),
    );
    failedQueue = [];
}

const handleRefreshToken = async function (_error) {
    const _original = _error.config;
    if (!_original || _original._retry) {
        // Ya se reintentó o no hay config
        return Promise.reject(_error);
    }
    const status = _error.response?.status;
    const errorCode = _error.response?.data?.error;
    const requestUrl = _original.url || "";
    const isRefreshEndpoint = requestUrl.includes("/auth/refresh");
    const shouldAttemptRefresh =
        !isRefreshEndpoint &&
        // La mayoría de casos es 401 (TokenExpiredError)
        status === 401;

    // Algunos servicios pueden responder 403 con `error: TOKEN_EXPIRED`
    const shouldAttemptRefreshFrom403 =
        !isRefreshEndpoint && status === 403 && errorCode === "TOKEN_EXPIRED";

    const shouldRefresh = shouldAttemptRefresh || shouldAttemptRefreshFrom403;

    if (shouldRefresh) {
        const retryClient =
            _original._axiosClient === "admin" ? axiosAdmin : axiosAuth;
        if (_isRefreshing) {
            // Si ya hay un refresh en curso, encola la petición
            return new Promise(function (resolve, reject) {
                failedQueue.push({ resolve, reject });
            })
                .then((token) => {
                    _original.headers["Authorization"] = "Bearer " + token;
                    return retryClient(_original);
                })
                .catch((err) => Promise.reject(err));
        }
        _original._retry = true;
        _isRefreshing = true;
        const refreshToken = useAuthStore.getState().refreshToken;
        if (!refreshToken) {
            // Este backend no emite refreshToken, así que no hay forma de refrescar.
            // No cerramos la sesión aquí: un 401 aislado (p. ej. una carrera al
            // montar un componente) no debe invalidar un token válido en memoria.
            _isRefreshing = false;
            return Promise.reject(_error);
        }
        try {
            const response = await axiosAuth.post("/auth/refresh", { refreshToken });
            const {
                accessToken,
                refreshToken: newRefreshToken,
                expiresIn,
                userDetails,
            } = response.data;
            useAuthStore.setState({
                token: accessToken,
                refreshToken: newRefreshToken,
                expiresAt: expiresIn,
                user: userDetails || useAuthStore.getState().user,
                isAuthenticated: true,
            });
            _processQueue(null, accessToken);
            _original.headers["Authorization"] = "Bearer " + accessToken;
            return retryClient(_original);
        } catch (err) {
            _processQueue(err, null);
            useAuthStore.getState().logout();
            return Promise.reject(err);
        } finally {
            _isRefreshing = false;
        }
    }
    return Promise.reject(_error);
};

axiosAuth.interceptors.response.use((res) => res, handleRefreshToken);

axiosAdmin.interceptors.response.use((res) => res, handleRefreshToken);

export { axiosAuth, axiosAdmin }

export { handleRefreshToken }