import React from "react";

type SidebarItemProps = {
    isActive: boolean;
    onClick: () => void;
    title: string;
    subtitle: string;
};

export function SidebarItem({ isActive, onClick, title, subtitle }: SidebarItemProps) {
    return (
        <div className={`p-4 cursor-pointer hover:bg-gray-700 ${isActive ? "bg-gray-700" : ""}`} onClick={onClick}>
            <h3 className="font-bold text-gray-200">{title}</h3>
            <p className="text-sm text-gray-400">{subtitle}</p>
        </div>
    );
}
