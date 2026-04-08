// dashboard/components/DateDisplay.jsx
export default function DateDisplay({ date, format = 'short', className = '' }) {
    if (!date) return <span className={`text-neutral-400 ${className}`}>-</span>;

    const dateObj = new Date(date);

    const formats = {
        short: () => dateObj.toLocaleDateString(),
        medium: () => dateObj.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }),
        long: () => dateObj.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }),
        full: () => dateObj.toLocaleDateString(undefined, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    };

    const formattedDate = formats[format] ? formats[format]() : formats.short();

    return <span className={`text-neutral-700 ${className}`}>{formattedDate}</span>;
}