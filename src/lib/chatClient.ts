export type ChatRole = 'user' | 'model';

export interface ChatTurn {
    role: ChatRole;
    text: string;
}

interface ChatApiResponse {
    reply?: string;
    suggestions?: string[];
    error?: string;
}

export interface ChatReply {
    reply: string;
    suggestions: string[];
}

export const CHAT_MESSAGE_MAX_LENGTH = 2000;

export class ChatClientError extends Error {
    status: number;

    constructor(message: string, status: number) {
        super(message);
        this.name = 'ChatClientError';
        this.status = status;
    }
}

function messageForStatus(status: number, fallback?: string): string {
    if (status === 429) {
        return 'Too many requests — please wait a moment.';
    }
    if (status === 400) {
        return fallback || 'That message could not be sent. Keep it under 2000 characters.';
    }
    if (status >= 500) {
        return 'Something went wrong generating a response.';
    }
    return fallback || 'Unable to reach the chatbot right now.';
}

export async function sendChatMessage(
    message: string,
    history: ChatTurn[],
): Promise<ChatReply> {
    let response: Response;

    try {
        response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message, history }),
        });
    } catch {
        throw new ChatClientError('Unable to reach the chatbot right now.', 0);
    }

    let payload: ChatApiResponse = {};
    try {
        payload = await response.json() as ChatApiResponse;
    } catch {
        payload = {};
    }

    if (!response.ok) {
        throw new ChatClientError(
            messageForStatus(response.status, payload.error),
            response.status,
        );
    }

    if (!payload.reply) {
        throw new ChatClientError('Something went wrong generating a response.', 500);
    }

    const suggestions = Array.isArray(payload.suggestions)
        ? payload.suggestions.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
        : [];

    return { reply: payload.reply, suggestions };
}
