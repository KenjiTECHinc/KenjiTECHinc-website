// src/components/atoms/Badge.tsx
interface BadgeProps {
    text: string;
}

export function Badge({ text }: BadgeProps) {
    return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-normal bg-primary-100 text-primary-650">
            {text}
        </span>
    );
}