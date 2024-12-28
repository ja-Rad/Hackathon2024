export const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>, metricsRef: React.RefObject<HTMLDivElement | null>): void => {
    const container = metricsRef.current;
    if (!container) return; // Handle null case explicitly

    const startX = event.pageX - container.offsetLeft;
    const scrollLeft = container.scrollLeft;

    const handleMouseMove = (e: MouseEvent) => {
        const x = e.pageX - container.offsetLeft;
        const walk = x - startX; // Distance moved
        container.scrollLeft = scrollLeft - walk;
    };

    const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
};
