import { Link } from 'react-router-dom';

export function InternalLinkButton({ to, children, variant = 'primary' }) {
    const baseStyle = "inline-block px-6 py-2.5 m-1 text-xs md:text-base font-medium rounded-lg shadow-sm transition-all text-center cursor-pointer";

    const variants = {
        primary: "bg-primary-500 hover:bg-primary-600 text-white",
        outline: "bg-transparent border-2 border-primary-500 text-primary-500 hover:bg-primary-100"
    };

    return (
        <Link to={to} className={`${baseStyle} ${variants[variant] || variants.primary}`}>
            {children}
        </Link>
    );
}