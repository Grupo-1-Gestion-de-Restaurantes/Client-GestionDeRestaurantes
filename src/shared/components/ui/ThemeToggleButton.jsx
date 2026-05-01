import { useThemeStore } from '../../store/useThemeStore';
import { Sun, MoonStar } from 'lucide-react';


export const ThemeToggleButton = () => {
    const { isDark, toggle } = useThemeStore();

    return (
        <button
            onClick={toggle}
            className="liquid-glass group relative px-5 py-2.5 rounded-full flex items-center gap-3 overflow-hidden"
        >
            <div className="relative z-10 flex items-center justify-center">
                {isDark ? (
                    <Sun
                        size={20}
                        strokeWidth={1.75}
                        className="text-brand-yellow animate-fadeIn transition-transform group-hover:rotate-45"
                    />
                ) : (
                    <MoonStar
                        size={20}
                        strokeWidth={1.75}
                        className="text-brand-dark-40 animate-fadeIn transition-transform group-hover:-rotate-12"
                    />
                )}
            </div>

            <span className="relative z-10 font-sans font-semibold text-xs uppercase tracking-widest text-primary opacity-80">
                {isDark ? 'Light Mode' : 'Dark Mode'}
            </span>
        </button>
    );
};