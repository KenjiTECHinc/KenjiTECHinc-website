import { useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ChatLauncherButton } from '../atoms/ChatLauncherButton';
import { ChatPanel } from './ChatPanel';
import { useChatContext } from '../../context/chatContext';
import { useOverDarkBackground } from '../../hooks/useOverDarkBackground';

export function ChatWidget() {
    const location = useLocation();
    const { messages, isPending, error, send } = useChatContext();
    const [isOpen, setIsOpen] = useState(false);
    const launcherRef = useRef<HTMLDivElement>(null);
    const onDark = useOverDarkBackground(launcherRef);

    if (location.pathname === '/agent') {
        return null;
    }

    return (
        <>
            {isOpen && (
                <div className="fixed right-5 bottom-24 z-40 flex h-[32rem] w-[min(24rem,calc(100vw-2.5rem))] flex-col bg-white">
                    <ChatPanel
                        messages={messages}
                        isPending={isPending}
                        error={error}
                        onSend={send}
                    />
                </div>
            )}
            <div ref={launcherRef} className="fixed right-5 bottom-5 z-40">
                <ChatLauncherButton
                    isOpen={isOpen}
                    onDark={onDark}
                    onClick={() => setIsOpen((open) => !open)}
                />
            </div>
        </>
    );
}
