import { createContext, useContext } from 'react';
import type { UseChatResult } from '../hooks/useChat';

export const ChatContext = createContext<UseChatResult | undefined>(undefined);

export function useChatContext(): UseChatResult {
    const context = useContext(ChatContext);

    if (!context) {
        throw new Error('useChatContext must be used inside a ChatProvider layout wrapper.');
    }

    return context;
}
