import { useUIStore } from "./store/uiStore";

export const ConfirmModal = () => {
    const { confirmModal, closeConfirm } = useUIStore();

    if (!confirmModal.isOpen) return null;

    // Detectar si es un tipo alerta/danger o warning (asumimos peligro por defecto, o basado en el titulo)
    const isDanger = confirmModal.title?.toLowerCase().includes("eliminar") || confirmModal.title?.toLowerCase().includes("cerrar");
    const borderColor = isDanger ? "border-[var(--color-brand-red,#C1292E)]" : "border-[var(--color-brand-yellow)]";
    const titleColor = isDanger ? "text-[var(--color-brand-red,#C1292E)]" : "text-[var(--color-brand-yellow)]";
    const btnColor = isDanger ? "bg-[var(--color-brand-red,#C1292E)]" : "bg-[var(--color-brand-yellow)] text-[var(--text-inverse)]";

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
            <div className={`bg-[var(--bg-surface)] p-6 rounded-xl w-96 text-center shadow-2xl border ${borderColor}`}>
                
                <h2 className={`text-xl font-bold mb-2 ${titleColor}`}>
                    {confirmModal.title}
                </h2>
                
                <p className="mb-6 text-[var(--text-secondary)]">
                    {confirmModal.message}
                </p>

                <div className="flex justify-center gap-4 mt-4">
                    <button
                        onClick={closeConfirm}
                        className="px-5 py-2 rounded-lg border border-[var(--color-brand-yellow)] text-[var(--color-brand-yellow)] font-medium hover:bg-[var(--color-brand-yellow)] hover:text-[var(--text-inverse)] transition"
                    >
                        Cancelar
                    </button>

                    <button
                        onClick={() => {
                            confirmModal.onConfirm?.();
                            closeConfirm();
                        }}
                        className={`px-5 py-2 rounded-lg font-medium hover:brightness-110 transition ${btnColor}`}
                    >
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    );
};