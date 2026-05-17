import { useThemeStore } from '../../store/useThemeStore';
import { Sun, MoonStar } from 'lucide-react';
import { LucideMotionIcon } from './LucideMotionIcon.jsx';


export const ThemeToggleButton = () => {
    const { isDark, toggle } = useThemeStore();

    return (
        <button
            onClick={toggle}
            className="liquid-glass group relative px-5 py-2.5 rounded-full flex items-center gap-3 overflow-hidden cursor-pointer transition-colors duration-300"
        >
            <div className="relative z-10 flex items-center justify-center">
                {isDark ? (
                    <LucideMotionIcon icon={Sun} className="animate-fadeIn" />
                ) : (
                    <LucideMotionIcon icon={MoonStar} className="animate-fadeIn" />
                )}
            </div>

            <span className="relative z-10 font-sans font-semibold text-xs uppercase tracking-widest text-primary opacity-80">
                {isDark ? 'Light Mode' : 'Dark Mode'}
            </span>
        </button>
    );
};