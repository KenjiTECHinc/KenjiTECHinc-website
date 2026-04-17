// src/components/atoms/LogoButton.jsx
import { SiGmail } from 'react-icons/si';
import { FaLinkedin, FaGithub, FaGlobe } from 'react-icons/fa6';

const colorVariants = {
    Linkedin: 'bg-sky-650 hover:bg-sky-800 text-white',
    Github: 'bg-zinc-800 hover:bg-zinc-900 text-white',
    Gmail: 'bg-red-650 hover:bg-red-700 text-white',
    Default: 'bg-primary-550 hover:bg-primary-600 text-white'
};

const iconMap = {
    Linkedin: FaLinkedin,
    Github: FaGithub,
    Gmail: SiGmail,
    Default: FaGlobe // fallback icon
};

export function LogoButton({ href, name, children }) {
    const activeColorClasses = colorVariants[name] || colorVariants.Default;
    const IconComponent = iconMap[name] || iconMap.Default;

    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-block px-4 py-2 m-1 items-center ${activeColorClasses} font-medium text-xs md:text-sm text-center rounded-lg shadow-sm transition-all duration-200 ease-in-out hover:scale-105 cursor-pointer ${href === '' ? 'pointer-events-none opacity-50' : 'opacity-100'}`}
        >
            <div className="flex items-center justify-center" aria-label={name}>
                <IconComponent aria-hidden="true" className="h-5 w-5 mr-3" />
                {children}
            </div>
        </a>
    );
}