import { useLayoutEffect, useRef, useState } from 'react';

interface ChatBubbleProps {
    role: 'user' | 'model';
    children: string;
    isTyping?: boolean;
}

export function ChatBubble({ role, children, isTyping = false }: ChatBubbleProps) {
    const isUser = role === 'user';
    const textRef = useRef<HTMLParagraphElement>(null);
    const [expanded, setExpanded] = useState(false);
    const [overflows, setOverflows] = useState(false);

    useLayoutEffect(() => {
        if (!isUser || isTyping) return;
        const text = textRef.current;
        if (!text) return;

        const measure = () => {
            const lineHeight = parseFloat(getComputedStyle(text).lineHeight);
            const fiveLines = (Number.isFinite(lineHeight) ? lineHeight : 16) * 5;
            setOverflows(text.scrollHeight > fiveLines + 1);
        };

        measure();
        const observer = new ResizeObserver(measure);
        observer.observe(text);
        return () => observer.disconnect();
    }, [children, expanded, isTyping, isUser]);

    return (
        <div
            className={`min-w-0 max-w-[85%] rounded-2xl px-4 py-3 text-left shadow-sm ${
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
                <>
                    <p
                        ref={textRef}
                        className={`mb-0 mt-0 whitespace-pre-wrap break-words ${isUser ? 'text-white' : ''} ${isUser && !expanded ? 'line-clamp-5' : ''}`}
                    >
                        {children}
                    </p>
                    {isUser && overflows && (
                        <button
                            type="button"
                            onClick={() => setExpanded((open) => !open)}
                            className="mt-2 cursor-pointer text-xs font-medium text-white underline decoration-white/70"
                        >
                            {expanded ? 'Show less' : 'Show more'}
                        </button>
                    )}
                </>
            )}
        </div>
    );
}
