import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Pagination = ({ pagination, onPageChange }) => {
    if (!pagination || pagination.totalPages <= 1) return null;

    const { currentPage, totalPages } = pagination;

    const handlePrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 border-t border-[var(--border-color)]">
            <div className="text-sm text-[var(--text-muted)]">
                Página <span className="font-semibold text-[var(--text-primary)]">{currentPage}</span> de <span className="font-semibold text-[var(--text-primary)]">{totalPages}</span>
                {pagination.totalRecords !== undefined && (
                    <span className="ml-1">
                        (<span className="font-semibold text-[var(--text-primary)]">{pagination.totalRecords}</span> registros)
                    </span>
                )}
            </div>
            
            <div className="flex items-center gap-4">
                <button
                    onClick={handlePrevious}
                    disabled={currentPage === 1}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--bg-surface)] text-[var(--text-primary)] hover:bg-[var(--bg-base)] border-[2px] border-[var(--border-color)] disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-sm hover:shadow-md"
                    aria-label="Anterior"
                >
                    <ChevronLeft size={18} />
                    <span>Anterior</span>
                </button>

                <button
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--bg-surface)] text-[var(--text-primary)] hover:bg-[var(--bg-base)] border-[2px] border-[var(--border-color)] disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-sm hover:shadow-md"
                    aria-label="Siguiente"
                >
                    <span>Siguiente</span>
                    <ChevronRight size={18} />
                </button>
            </div>
        </div>
    );
};
