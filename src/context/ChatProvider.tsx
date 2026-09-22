import type { ReactNode } from 'react';
import { ChatContext } from './chatContext';
import { useChat } from '../hooks/useChat';

interface ChatProviderProps {
    children: ReactNode;
}

export function ChatProvider({ children }: ChatProviderProps) {
    const chat = useChat();

    return (
        <ChatContext.Provider value={chat}>
            {children}
        </ChatContext.Provider>
    );
}
