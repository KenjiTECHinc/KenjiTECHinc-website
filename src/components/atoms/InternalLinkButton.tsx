import { Link } from 'react-router-dom';
import type { MouseEventHandler, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'outline';

interface InternalLinkButtonProps {
    to: string;
    children: ReactNode;
    variant?: ButtonVariant;
    label?: string;
    state?: unknown;
    onClick?: MouseEventHandler<HTMLAnchorElement>;
}

export function InternalLinkButton({
    to,
    children,
    variant = 'primary',
    label,
    state,
    onClick,
}: InternalLinkButtonProps) {
    const baseStyle = "inline-block px-6 py-2 m-1 text-xs md:text-sm font-medium rounded-lg shadow-sm transition-all text-center cursor-pointer";

    const variants: Record<ButtonVariant, string> = {
        primary: "bg-primary-550 hover:bg-primary-600 text-white",
        outline: "bg-transparent border-2 border-primary-550 text-primary-550 hover:bg-primary-100"
    };

    return (
        <Link
            to={to}
            state={state}
            onClick={onClick}
            className={`${baseStyle} ${variants[variant] || variants.primary}`}
            aria-label={label}
        >
            {children}
        </Link>
    );
}
