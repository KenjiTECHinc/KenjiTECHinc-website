import { useCallback, useState } from 'react';
import {
    CHAT_MESSAGE_MAX_LENGTH,
    sendChatMessage,
} from '../lib/chatClient';
import type { ChatTurn } from '../lib/chatClient';

export interface UseChatResult {
    messages: ChatTurn[];
    isPending: boolean;
    error: string | null;
    send: (text: string) => Promise<void>;
}

export function useChat(): UseChatResult {
    const [messages, setMessages] = useState<ChatTurn[]>([]);
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const send = useCallback(async (rawText: string) => {
        const text = rawText.trim();
        if (!text || isPending) return;

        if (text.length > CHAT_MESSAGE_MAX_LENGTH) {
            setError(`Messages can be at most ${CHAT_MESSAGE_MAX_LENGTH} characters.`);
            return;
        }

        const history = messages;
        const userTurn: ChatTurn = { role: 'user', text };

        setMessages((current) => [...current, userTurn]);
        setIsPending(true);
        setError(null);

        try {
            const reply = await sendChatMessage(text, history);
            setMessages((current) => [...current, { role: 'model', text: reply }]);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unable to reach the chatbot right now.');
        } finally {
            setIsPending(false);
        }
    }, [isPending, messages]);

    return { messages, isPending, error, send };
}
