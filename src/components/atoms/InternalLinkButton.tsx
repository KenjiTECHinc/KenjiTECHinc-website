import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';

type ButtonVariant = 'primary' | 'outline';

interface InternalLinkButtonProps {
    to: string;
    children: ReactNode;
    variant?: ButtonVariant;
    label?: string;
}

export function InternalLinkButton({ to, children, variant = 'primary', label }: InternalLinkButtonProps) {
    const baseStyle = "inline-block px-6 py-2 m-1 text-xs md:text-base font-medium rounded-lg shadow-sm transition-all text-center cursor-pointer";

    const variants: Record<ButtonVariant, string> = {
        primary: "bg-primary-550 hover:bg-primary-600 text-white",
        outline: "bg-transparent border-2 border-primary-550 text-primary-550 hover:bg-primary-100"
    };

    return (
        <Link to={to} className={`${baseStyle} ${variants[variant] || variants.primary}`} aria-label={label}>
            {children}
        </Link>
    );
}
