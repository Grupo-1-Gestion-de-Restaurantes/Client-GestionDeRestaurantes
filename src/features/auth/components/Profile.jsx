import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAuthStore } from "../store/useAuthStore";
import { showSuccess, showError } from "../../../shared/utils/toast";
import { Spinner } from "../../../shared/components/layout/Spinner";
import { Camera, Mail, User, Phone, ShieldCheck, Lock, LogOut } from "lucide-react";
import { LucideMotionIcon } from "../../../shared/components/ui/LucideMotionIcon";
import { useNavigate } from "react-router-dom";
import defaultAvatarImg from "../../../assets/img/avatarDefault.png";

export const Profile = () => {
    const { user, loading, updateProfile, getProfile, logout } = useAuthStore();
    const [preview, setPreview] = useState(null);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm();

    const photoFile = watch("profilePicture");

    useEffect(() => {
        const fetchProfile = async () => {
            await getProfile();
        };
        fetchProfile();
    }, [getProfile]);

    useEffect(() => {
        if (user) {
            reset({
                name: user.name || "",
                surname: user.surname || "",
                phone: user.phone || "",
            });
            setPreview(user.profilePicture);
        }
    }, [user, reset]);

    useEffect(() => {
        if (photoFile && photoFile.length > 0) {
            const file = photoFile[0];
            setPreview(URL.createObjectURL(file));
        }
    }, [photoFile]);

    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("surname", data.surname);
        formData.append("phone", data.phone);
        
        if (data.profilePicture && data.profilePicture[0]) {
            formData.append("profilePicture", data.profilePicture[0]);
        }

        const res = await updateProfile(formData);
        if (res.success) {
            showSuccess("Perfil actualizado correctamente");
        } else {
            showError(res.error);
        }
    };

    const handleForgotPassword = () => {
        // Redirigir a login con el estado para mostrar el form de recuperar contraseña
        logout();
        navigate("/", { state: { view: 'forgot', email: user?.email } });
    };

    if (loading && !user?.name) return <Spinner />;

    return (
        <div className="p-4 sm:p-8 max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[var(--text-primary)]">Mi Perfil</h1>
                <p className="text-[var(--text-muted)] mt-1">Gestiona tu información personal y configuración de cuenta</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* LADO IZQUIERDO: AVATAR Y ACCIONES RÁPIDAS */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-[var(--bg-surface)] rounded-2xl p-6 border border-[var(--border-color)] shadow-sm flex flex-col items-center">
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[var(--color-brand-dark)] bg-[var(--bg-base)]">
                                <img 
                                    src={preview || defaultAvatarImg} 
                                    alt="Avatar" 
                                    className="w-full h-full object-cover"
                                    onError={(e) => { e.target.src = defaultAvatarImg; }}
                                />
                            </div>
                            <label className="absolute bottom-0 right-0 p-2 bg-[var(--color-brand-dark)] text-white rounded-full cursor-pointer hover:bg-[var(--color-brand-red)] transition-colors shadow-lg">
                                <Camera size={18} />
                                <input 
                                    type="file" 
                                    className="hidden" 
                                    accept="image/*"
                                    {...register("profilePicture")}
                                />
                            </label>
                        </div>
                        
                        <div className="mt-4 text-center">
                            <h2 className="text-xl font-bold text-[var(--text-primary)]">{user?.username}</h2>
                            <div className="flex items-center justify-center gap-1.5 mt-1">
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[var(--color-brand-yellow)] text-[var(--color-brand-dark)] uppercase tracking-wider">
                                    {user?.role?.replace("_ROLE", "")}
                                </span>
                                {user?.isEmailVerified && (
                                    <span className="flex items-center gap-1 text-[10px] text-green-600 font-bold uppercase tracking-wider">
                                        <ShieldCheck size={12} /> Verificado
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="bg-[var(--bg-surface)] rounded-2xl p-2 border border-[var(--border-color)] shadow-sm">
                        <button 
                            onClick={handleForgotPassword}
                            className="w-full flex items-center gap-3 p-3 text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--bg-base)] rounded-xl transition-colors text-left"
                        >
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                                <Lock size={18} />
                            </div>
                            <div>
                                <p>Cambiar Contraseña</p>
                                <p className="text-[10px] text-[var(--text-muted)] font-normal">Recibir enlace al correo</p>
                            </div>
                        </button>
                    </div>
                </div>

                {/* LADO DERECHO: FORMULARIO */}
                <div className="lg:col-span-2">
                    <form onSubmit={handleSubmit(onSubmit)} className="bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-color)] shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-[var(--border-color)]">
                            <h3 className="text-lg font-bold text-[var(--text-primary)]">Información Personal</h3>
                        </div>
                        
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-[var(--text-secondary)] ml-1">Nombre</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-3 flex items-center text-[var(--text-muted)] pointer-events-none">
                                            <User size={18} />
                                        </div>
                                        <input 
                                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:border-[var(--color-brand-dark)] outline-none transition"
                                            {...register("name", { 
                                                required: "El nombre es obligatorio",
                                                minLength: { value: 2, message: "Mínimo 2 caracteres" },
                                                maxLength: { value: 25, message: "Máximo 25 caracteres" }
                                            })}
                                        />
                                    </div>
                                    {errors.name && <p className="text-red-500 text-xs ml-1">{errors.name.message}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-[var(--text-secondary)] ml-1">Apellido</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-3 flex items-center text-[var(--text-muted)] pointer-events-none">
                                            <User size={18} />
                                        </div>
                                        <input 
                                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:border-[var(--color-brand-dark)] outline-none transition"
                                            {...register("surname", { 
                                                required: "El apellido es obligatorio",
                                                minLength: { value: 2, message: "Mínimo 2 caracteres" },
                                                maxLength: { value: 25, message: "Máximo 25 caracteres" }
                                            })}
                                        />
                                    </div>
                                    {errors.surname && <p className="text-red-500 text-xs ml-1">{errors.surname.message}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-[var(--text-secondary)] ml-1">Correo Electrónico</label>
                                    <div className="relative opacity-70">
                                        <div className="absolute inset-y-0 left-3 flex items-center text-[var(--text-muted)] pointer-events-none">
                                            <Mail size={18} />
                                        </div>
                                        <input 
                                            readOnly
                                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-[var(--border-color)] bg-[var(--bg-surface-alt)] text-[var(--text-primary)] cursor-not-allowed outline-none"
                                            value={user?.email || ""}
                                        />
                                    </div>
                                    <p className="text-[10px] text-[var(--text-muted)] ml-1 italic">El correo no puede modificarse por seguridad</p>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-[var(--text-secondary)] ml-1">Teléfono</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-3 flex items-center text-[var(--text-muted)] pointer-events-none">
                                            <Phone size={18} />
                                        </div>
                                        <input 
                                            type="text"
                                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:border-[var(--color-brand-dark)] outline-none transition"
                                            placeholder="55554444"
                                            {...register("phone", { 
                                                required: "El teléfono es obligatorio",
                                                pattern: { value: /^\d{8}$/, message: "Debe tener exactamente 8 dígitos" }
                                            })}
                                        />
                                    </div>
                                    {errors.phone && <p className="text-red-500 text-xs ml-1">{errors.phone.message}</p>}
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-[var(--bg-surface-alt)] flex justify-end gap-3">
                            <button 
                                type="button"
                                onClick={() => reset()}
                                className="px-6 py-2 rounded-xl text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--bg-base)] transition-colors"
                            >
                                Revertir
                            </button>
                            <button 
                                type="submit"
                                disabled={loading}
                                className="px-8 py-2 rounded-xl text-sm font-bold text-white bg-[var(--color-brand-dark)] hover:bg-[var(--color-brand-red)] shadow-md transition-all active:scale-[0.98] disabled:opacity-70"
                            >
                                {loading ? "Guardando..." : "Guardar Cambios"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
