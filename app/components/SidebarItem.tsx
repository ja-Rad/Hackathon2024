import React from "react";

type SidebarItemProps = Readonly<{
    isActive: boolean;
    onClick: () => void;
    title: string;
    subtitle: string;
    cpi: string;
}>;

export function SidebarItem({ isActive, onClick, title, subtitle, cpi }: SidebarItemProps) {
    return (
        <button className={`w-full text-left p-4 hover:bg-primary-hover ${isActive ? "bg-primary" : "bg-background-card"}`} onClick={onClick}>
            <h3 className={`font-bold ${isActive ? "text-white" : "text-text-light"}`}>{title}</h3>
            <p className="text-sm text-text-muted">{subtitle}</p>
            <p className="text-sm text-text-muted">{cpi}</p>
        </button>
    );
}
