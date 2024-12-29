export function determineSeason(date: string): string {
    const [, monthStr, yearStr] = date.split("/");
    const month = Number(monthStr);
    const year = Number(yearStr);

    return `${month >= 8 ? year : year - 1}/${month >= 8 ? year + 1 : year}`;
}
