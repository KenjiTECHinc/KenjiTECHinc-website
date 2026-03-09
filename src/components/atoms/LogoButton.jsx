// src/components/atoms/LogoButton.jsx
import { Globe } from 'lucide-react';
import { FaLinkedin, FaGithub } from 'react-icons/fa';

const colorVariants = {
    linkedIn: 'bg-sky-600 hover:bg-sky-700 text-white',
    github: 'bg-zinc-800 hover:bg-zinc-900 text-white',
    primary: 'bg-primary-500 hover:bg-primary-600 text-white'
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
            className={`inline-block px-4 py-2 m-2 items-center ${activeColorClasses} font-medium text-sm text-center rounded-lg shadow-md transition-all duration-200 ease-in-out hover:scale-105 cursor-pointer ${href === '' ? 'pointer-events-none opacity-50' : 'opacity-100'}`}
        >
            <div className="flex items-center justify-center">
                <IconComponent aria-label={altText} className="h-5 w-5 mr-3" />
                {children}
            </div>
        </a>
    );
}