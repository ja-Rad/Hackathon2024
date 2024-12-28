import React, { useState } from "react";

function TooltipIcon({ tooltipText }: { tooltipText: string }) {
    const [tooltipPosition, setTooltipPosition] = useState<{ top: number; left: number } | null>(null);

    const handleMouseMove = (event: React.MouseEvent) => {
        const { clientX, clientY } = event;
        setTooltipPosition({ top: clientY + 20, left: clientX + 10 }); // Position slightly below and to the right
    };

    const handleMouseLeave = () => {
        setTooltipPosition(null); // Hide tooltip when mouse leaves
    };

    return (
        <span className="relative group cursor-pointer ml-2" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
            {tooltipPosition && (
                <span
                    className="bg-gray-800 text-white text-sm px-4 py-2 rounded absolute z-10 max-w-xs break-words"
                    style={{
                        top: tooltipPosition.top,
                        left: tooltipPosition.left,
                        position: "fixed", // Use fixed to ensure it follows the mouse
                        whiteSpace: "pre-wrap", // Allow wrapping of text
                    }}
                >
                    {tooltipText}
                </span>
            )}
            <span className="inline-block w-4 h-4 bg-blue-500 text-white text-center rounded-full font-bold">?</span>
        </span>
    );
}

export default TooltipIcon;
