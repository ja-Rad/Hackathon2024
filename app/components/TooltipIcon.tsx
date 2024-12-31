import React, { useState } from "react";

export default function TooltipIcon({ tooltipText }: Readonly<{ tooltipText: string }>) {
    const [tooltipPosition, setTooltipPosition] = useState<{
        top: number;
        left: number;
    } | null>(null);

    const handleMouseMove = (event: React.MouseEvent) => {
        const { clientX, clientY } = event;
        setTooltipPosition({ top: clientY + 20, left: clientX + 10 });
    };

    const handleMouseLeave = () => {
        setTooltipPosition(null);
    };
    
    return (
        <span // NOSONAR
            className="relative group cursor-pointer ml-2"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {tooltipPosition && (
                <span
                    className="bg-background-card text-text-light text-sm px-4 py-2 rounded absolute z-10 max-w-xs break-words"
                    style={{
                        top: tooltipPosition.top,
                        left: tooltipPosition.left,
                        position: "fixed",
                        whiteSpace: "pre-wrap",
                    }}
                >
                    {tooltipText}
                </span>
            )}
            <span className="inline-block w-4 h-4 bg-primary-light text-white text-center rounded-full font-bold">?</span>
        </span>
    );
}
