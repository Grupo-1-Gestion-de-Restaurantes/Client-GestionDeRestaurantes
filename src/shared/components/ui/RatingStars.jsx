import { Star } from "lucide-react";

export const RatingStars = ({ rating = 0, max = 5, size = 14, className = "" }) => {
    const ratingNumber = Math.max(0, Math.min(max, Number(rating) || 0));

    return (
        <span className={`inline-flex items-center gap-0.5 align-middle ${className}`.trim()}>
            {Array.from({ length: max }, (_, index) => {
                const fillPercent = Math.max(0, Math.min(1, ratingNumber - index)) * 100;
                return (
                    <span key={index} className="relative inline-block" style={{ width: size, height: size }}>
                        <Star size={size} className="absolute inset-0 text-gray-300 dark:text-zinc-600" aria-hidden />
                        <span className="absolute inset-0 overflow-hidden" style={{ width: `${fillPercent}%` }}>
                            <Star size={size} className="text-yellow-500" fill="currentColor" aria-hidden />
                        </span>
                    </span>
                );
            })}
        </span>
    );
};
