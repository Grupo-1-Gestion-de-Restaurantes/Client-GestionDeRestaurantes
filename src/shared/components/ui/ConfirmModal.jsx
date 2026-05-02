import { useUIStore } from "./store/uiStore";

export const ConfirmModal = () => {
    const { confirmModal, closeConfirm } = useUIStore();

    if (!confirmModal.isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-[var(--bg-surface)] p-6 rounded-xl w-96 text-center shadow-2xl border border-[var(--color-brand-red,#C1292E)]">
                
                <h2 className="text-xl font-bold mb-2 text-[var(--color-brand-red,#C1292E)]">
                    {confirmModal.title}
                </h2>
                
                <p className="mb-6 text-[var(--text-secondary)]">
                    {confirmModal.message}
                </p>

                <div className="flex justify-center gap-4 mt-4">
                    <button
                        onClick={closeConfirm}
                        className="px-5 py-2 rounded-lg border border-[#F1D302] text-[#F1D302] font-medium hover:bg-[#F1D302] hover:text-black transition"
                    >
                        Cancelar
                    </button>

                    <button
                        onClick={() => {
                            confirmModal.onConfirm?.();
                            closeConfirm();
                        }}
                        className="px-5 py-2 rounded-lg bg-[var(--color-brand-red,#C1292E)] text-white font-medium hover:brightness-110 transition"
                    >
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    );
};