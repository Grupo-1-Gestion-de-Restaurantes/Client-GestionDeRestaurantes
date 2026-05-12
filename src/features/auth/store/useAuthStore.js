import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
    forgotPassword,
    login as loginRequest,
    register as registerRequest,
    resetPassword as resetPasswordRequest
} from "../../../shared/api"
import { showError } from "../../../shared/utils/toast";

export const useAuthStore = create(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            refreshToken: null,
            expiresAt: null,
            loading: false,
            error: null,
            isAuthenticated: false,
            isLoadingAuth: true,

            checkAuth: () => {
                const token = get().token;
                const role = get().user?.role;

                if (token && role && role !== "ADMIN_ROLE") {
                    set({
                        user: null,
                        token: null,
                        refreshToken: null,
                        expiresAt: null,
                        isAuthenticated: false,
                        isLoadingAuth: false,
                        loading: false,
                        error: "No tienes permisos para acceder como administrador."
                    })
                    return;
                }

                set({
                    isLoadingAuth: false,
                    isAuthenticated: Boolean(token) && (!role || role === "ADMIN_ROLE")
                })
            },

            logout: () => {
                set({
                    user: null,
                    token: null,
                    expiresAt: null,
                    isAuthenticated: false
                })
            },

            register: async (formData) => {
                try {
                    set({ loading: true, error: null });
                    const { data } = await registerRequest(formData);
                    set({ loading: false });
                    return {
                        success: true,
                        emailVerificationRequired: data?.emailVerificationRequired,
                        data
                    }
                } catch (err) {
                    const message = err.response?.data.message || "Error al registrarse";
                    set({ error: message, loading: false });
                    return { success: false, error: message }
                }
            },

            login: async ({ emailOrUsername, password }) => {
                try {
                    set({ loading: true, error: null });

                    const { data } = await loginRequest({ emailOrUsername, password })
                    const accessToken = data?.token || data?.accessToken || null;

                    const role = data?.userDetails?.role;

                    if (role !== "ADMIN_ROLE") {
                        const message =
                            "No tienes permisos para acceder como administrador"
                        set({
                            user: null,
                            token: null,
                            refreshToken: null,
                            expiresAt: null,
                            isAuthenticated: false,
                            isLoadingAuth: false,
                            loading: false,
                            error: message
                        })

                        showError(message);
                        return { success: false, error: message }
                    }

                    if (!accessToken) {
                        const message =
                            data?.requiresTwoFactor
                                ? "Se requiere verificación de dos factores para completar el inicio de sesión"
                                : "La respuesta de login no incluye token de acceso";

                        set({
                            user: data?.userDetails ?? null,
                            token: null,
                            refreshToken: null,
                            expiresAt: data?.expiresAt ?? null,
                            isAuthenticated: false,
                            isLoadingAuth: false,
                            loading: false,
                            error: message
                        });

                        return { success: false, error: message };
                    }

                    set({
                        user: data.userDetails,
                        token: accessToken,
                        refreshToken: data.refreshToken ?? null,
                        expiresAt: data.expiresAt,
                        loading: false,
                        isLoadingAuth: false,
                        isAuthenticated: true
                    })

                    return { success: true }

                } catch (err) {
                    console.error("Login error: ", err);
                    const message =
                        err.response?.data?.message || "Error de autenticación";
                    set({ error: message, loading: false })
                    return { success: false, error: message }
                } finally {
                    set({ loading: false });
                }
            },
            requestPasswordReset: async (email) => {
                try {
                    set({ loading: true, error: null });
                    const { data } = await forgotPassword(email);
                    set({ loading: false });
                    return { success: true, data }
                } catch (err) {
                    const message = err.response?.data?.message || "Error al solicitar restablecimiento de contraseña";
                    set({ error: message, loading: false });
                    return { success: false, error: message }
                }
            },
            resetPassword: async (token, newPassword) => {
                try {
                    set({ loading: true, error: null });
                    const { data } = await resetPasswordRequest(token, newPassword);
                    set({ loading: false });
                    return { success: true, data }
                } catch (err) {
                    const message = err.response?.data?.message || "Error al restablecer la contraseña";
                    set({ error: message, loading: false });
                    return { success: false, error: message }
                }
            }
        }),
        {
            name: "auth-storage",
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                refreshToken: state.refreshToken,
                expiresAt: state.expiresAt,
                isAuthenticated: state.isAuthenticated
            }),
        }

    )
)