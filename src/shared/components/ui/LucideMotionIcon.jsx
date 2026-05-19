import React from "react";

const baseClassName =
    "w-5 h-5 md:w-6 md:h-6 shrink-0 transition-all duration-300 hover:-translate-y-1 hover:scale-110 group-hover:-translate-y-1 group-hover:scale-110";

export const LucideMotionIcon = ({ icon: Icon, className = "", strokeWidth = 1.75, ...props }) => {
    if (!Icon) return null;

    return (
        <Icon
            strokeWidth={strokeWidth}
            className={`${baseClassName} ${className}`.trim()}
            {...props}
        />
    );
};