// src/components/atoms/ScrollIndicator.jsx
import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export function ScrollIndicator({ targetId }) {
    const [isVisible, setIsVisible] = useState(true);

    // Listen to the window scroll event to hide/show the button
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }
        };

        window.addEventListener('scroll', handleScroll);

        // Cleanup the event listener
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleScrollClick = () => {
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' }); //smoothly scroll to the target section fetched by getElementById
        }
    };

    return (
        <div
            className={`absolute bottom-8 flex justify-center transition-opacity duration-500 
            ${isVisible ? 'opacity-100 animate-bounce' : 'opacity-0 pointer-events-none'}`}
        >
            <button
                onClick={handleScrollClick}
                aria-label="Scroll to next section"
                className='p-1 rounded-full bg-white flex items-center justify-center animate-high-tech-pulse cursor-pointer'>
                <ChevronDown size={48} strokeWidth={1.5} aria-hidden="true" />
            </button>
        </div>
    );
}