import React from "react";

interface HeaderMenuProps {
    left?: React.ReactNode;
    right?: React.ReactNode;
    children?: React.ReactNode;
    hidden?: boolean;
    title?: string;
}

export const HeaderItem: React.FC<HeaderMenuProps> = ({ hidden, title, left, right, children }) => {
    if (hidden) {
        return null;
    }
    return (
        <div
            className="flex items-center justify-between   bg-white"
        >
            {/* Left: custom or default */}
            <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                    {left}
                </div>
                {/* Center: title (optional) */}
                {title && (
                    <div className="flex-1 text-center text-[#F89A1C] font-semibold">{title}</div>
                )}
            </div>
            {/* Center: children (optional) */}
            {children && (
                <div className="flex-1 text-center">{children}</div>
            )}
            {/* Right: custom or default */}
            {right && <div className="flex gap-2">{right}</div>} 
        </div>
    );
};

export default HeaderItem;
