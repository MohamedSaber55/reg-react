// dashboard/components/StatusBadge.jsx
export default function StatusBadge({ status, activeText = 'Active', inactiveText = 'Inactive' }) {
    return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${status
                ? 'bg-success-100 text-success-800'
                : 'bg-error-100 text-error-800'
            }`}>
            <span className={`w-2 h-2 rounded-full me-2 ${status ? 'bg-success-500' : 'bg-error-500'
                }`}></span>
            {status ? activeText : inactiveText}
        </span>
    );
}