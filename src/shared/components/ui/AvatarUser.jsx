import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../../../features/auth/store/useAuthStore";
import defaultAvatarImg from "../../../assets/img/avatarDefault.png";
import { useUIStore } from "./store/uiStore"; 
import { Spinner } from "../layout/Spinner"; 

export const AvatarUser = () => {
    const store = useAuthStore ? useAuthStore() : {};
    const user = store?.user || null;
    const logout = store?.logout || (() => console.log("Logout pendiente de implementar"));

    const [open, setOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    
    // Traemos la función para abrir el modal de confirmación
    const openConfirm = useUIStore((state) => state.openConfirm);

    const toggleMenu = () => setOpen((prev) => !prev);

    useEffect(() => {
        const handleClickOutside = (evento) => {
            if (dropdownRef.current && !dropdownRef.current.contains(evento.target)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const handleLogoutClick = () => {
        setOpen(false);
        openConfirm({
            title: "Cerrar sesión",
            message: "¿Estás seguro de que deseas cerrar tu sesión actual?",
            onConfirm: async () => {
                setIsLoggingOut(true); 
                
                try {
                    await logout(); 
                    navigate("/", { replace: true });
                } catch (error) {
                    console.error("Error al cerrar sesión", error);
                } finally {
                    setIsLoggingOut(false);
                }
            }
        });
    }

    const avatarSrc =
        user?.profilePicture && user.profilePicture.trim() !== ""
            ? user.profilePicture
            : defaultAvatarImg;

    return (
        <>
            {isLoggingOut && (
                <div className="fixed inset-0 z-[60]">
                    <Spinner />
                </div>
            )}

            <div className="relative" ref={dropdownRef}>
                <img
                    onClick={toggleMenu}
                    src={avatarSrc}
                    alt={user?.username || "User"}
                    className="w-10 h-10 rounded-full object-cover border-2 border-[var(--ring-color)] cursor-pointer hover:shadow-[0_0_8px_var(--ring-color)] transition-shadow"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = defaultAvatarImg;
                    }}
                />

                {open && (
                    <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-48 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg shadow-xl animate-fadeIn z-50">
                        <div className="px-4 py-3 border-b border-[var(--border-color)]">
                            <p className="font-semibold text-[var(--text-primary)]">{user?.username || "User"}</p>
                            <p className="text-sm text-[var(--text-secondary)] truncate">{user?.email || "user@email.com"}</p>
                        </div>

                        <ul className="p-2 text-sm text-[var(--text-primary)] font-medium">
                            <li>
                                <Link
                                    to="/dashboard"
                                    className="block w-full p-2 rounded-md hover:bg-[var(--bg-surface-alt)] transition-colors"
                                >
                                    Dashboard
                                </Link>
                            </li>

                            <li>
                                <button
                                    onClick={handleLogoutClick}
                                    className="block w-full text-left p-2 mt-1 rounded-md hover:bg-[var(--color-brand-red)] hover:text-white text-[var(--color-brand-red)] transition-colors"
                                >
                                    Cerrar sesión
                                </button>
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </>
    )
}