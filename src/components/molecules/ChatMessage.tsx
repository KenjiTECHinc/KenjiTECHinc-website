import { ChatBubble } from '../atoms/ChatBubble';
import type { ChatRole } from '../../lib/chatClient';

interface ChatMessageProps {
    role: ChatRole;
    text: string;
    isTyping?: boolean;
}

export function ChatMessage({ role, text, isTyping = false }: ChatMessageProps) {
    const label = role === 'user' ? 'You' : 'Agent';

    return (
        <div className={`flex flex-col gap-1 ${role === 'user' ? 'items-end' : 'items-start'}`}>
            <span className="font-mono text-xs font-semibold text-text-500">
                {label}
            </span>
            <ChatBubble role={role} isTyping={isTyping}>
                {text}
            </ChatBubble>
        </div>
    );
}
