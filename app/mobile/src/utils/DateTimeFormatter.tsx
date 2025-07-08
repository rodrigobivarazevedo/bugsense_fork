export const formatDateTimeGerman = (dateStr: string) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

export const formatDate = (
    dateStr: string,
    format: 'long' | 'short' = 'long',
    showYear = true,
    showDayOfWeek = false
) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, { year: showYear ? 'numeric' : undefined, month: format, day: '2-digit', weekday: showDayOfWeek ? 'long' : undefined });
}

export const formatTime = (dateStr: string, timeFormat: '12' | '24') => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
        hour12: timeFormat === '12',
    });
}
