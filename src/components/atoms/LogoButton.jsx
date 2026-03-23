// src/components/atoms/LogoButton.jsx
import { Globe } from 'lucide-react';
import { FaLinkedin, FaGithub } from 'react-icons/fa';

const colorVariants = {
    linkedIn: 'bg-sky-650 hover:bg-sky-800 text-white',
    github: 'bg-zinc-800 hover:bg-zinc-900 text-white',
    primary: 'bg-primary-550 hover:bg-primary-600 text-white'
};

const iconMap = {
    Linkedin: FaLinkedin,
    Github: FaGithub,
    Globe: Globe // fallback icon
};

export function LogoButton({ href, iconName, altText, colorVariant, children }) {
    const activeColorClasses = colorVariants[colorVariant] || colorVariants.primary;
    const IconComponent = iconMap[iconName] || iconMap.Globe;

    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-block px-4 py-2 m-1 items-center ${activeColorClasses} font-medium text-xs md:text-sm text-center rounded-lg shadow-sm transition-all duration-200 ease-in-out hover:scale-105 cursor-pointer ${href === '' ? 'pointer-events-none opacity-50' : 'opacity-100'}`}
        >
            <div className="flex items-center justify-center" aria-label={altText}>
                <IconComponent aria-hidden="true" className="h-5 w-5 mr-3" />
                {children}
            </div>
        </a>
    );
}