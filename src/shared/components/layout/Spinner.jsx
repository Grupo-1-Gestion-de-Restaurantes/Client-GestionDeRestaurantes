export const Spinner = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-[var(--bg-surface)]/80 backdrop-blur-sm">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#F1D302] border-t-transparent"></div>
    </div>
  )
}