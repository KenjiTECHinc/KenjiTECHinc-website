// src/components/atoms/ExternalLinkButton.jsx
export function ExternalButton({ href, children }) {
    return (
        <a
            href={href}
            target="_blank" // open the link in a new tab
            rel="noopener noreferrer" // security best practice
            className={`inline-block px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium text-sm text-center rounded-lg shadow-sm transition-all cursor-pointer ${href === '' ? 'pointer-events-none opacity-50' : 'opacity-100'}`}
        >
            {children}
        </a>
    );
}