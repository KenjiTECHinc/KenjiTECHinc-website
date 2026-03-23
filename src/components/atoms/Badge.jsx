// src/components/atoms/Badge.jsx
export function Badge({ text }) {
    return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-normal bg-primary-100 text-primary-600">
            {text}
        </span>
    );
}