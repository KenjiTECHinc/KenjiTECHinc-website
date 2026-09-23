import { MessageCircle, X } from 'lucide-react';

interface ChatLauncherButtonProps {
    isOpen: boolean;
    onDark?: boolean;
    onClick: () => void;
}

export function ChatLauncherButton({ isOpen, onDark = false, onClick }: ChatLauncherButtonProps) {
    const colorClasses = onDark
        ? 'bg-white text-primary-550 hover:bg-primary-50'
        : 'bg-primary-550 text-white hover:bg-primary-600';

    return (
        <button
            type="button"
            onClick={onClick}
            aria-label={isOpen ? 'Close chat' : 'Open chat'}
            className={`flex h-14 w-14 cursor-pointer items-center justify-center rounded-full shadow-lg transition-all hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 ${colorClasses}`}
        >
            {isOpen ? (
                <X aria-hidden="true" className="h-6 w-6" />
            ) : (
                <MessageCircle aria-hidden="true" className="h-6 w-6" />
            )}
        </button>
    );
}
