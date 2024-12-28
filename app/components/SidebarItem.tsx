import React from "react";

type SidebarItemProps = Readonly<{
    isActive: boolean;
    onClick: () => void;
    title: string;
    subtitle: string;
}>;

export function SidebarItem({ isActive, onClick, title, subtitle }: SidebarItemProps) {
    return (
        <button className={`w-full text-left p-4 hover:bg-gray-700 ${isActive ? "bg-gray-700" : ""}`} onClick={onClick}>
            <h3 className="font-bold text-gray-200">{title}</h3>
            <p className="text-sm text-gray-400">{subtitle}</p>
        </button>
    );
}
