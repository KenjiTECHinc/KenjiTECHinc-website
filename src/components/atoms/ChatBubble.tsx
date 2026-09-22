interface ChatBubbleProps {
    role: 'user' | 'model';
    children: string;
    isTyping?: boolean;
}

export function ChatBubble({ role, children, isTyping = false }: ChatBubbleProps) {
    const isUser = role === 'user';

    return (
        <div
            className={`max-w-[85%] rounded-2xl px-4 py-3 text-left shadow-sm ${
                isUser
                    ? 'ml-auto bg-primary-550 text-white'
                    : 'mr-auto border border-border-200 bg-white text-text-700'
            }`}
        >
            {isTyping ? (
                <span className="inline-flex items-center gap-1 py-1" aria-label="Agent is typing">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-primary-550 [animation-delay:-0.3s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-primary-500 [animation-delay:-0.15s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-primary-300" />
                </span>
            ) : (
                <p className={`mb-0 mt-0 whitespace-pre-wrap ${isUser ? 'text-white' : ''}`}>
                    {children}
                </p>
            )}
        </div>
    );
}
