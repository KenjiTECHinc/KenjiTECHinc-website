import { useLayoutEffect, useRef, useState } from 'react';
import type { Components } from 'react-markdown';
import ReactMarkdown from 'react-markdown';

interface ChatBubbleProps {
    role: 'user' | 'model';
    children: string;
    isTyping?: boolean;
}

const agentMarkdownComponents: Components = {
    a: ({ href, children }) => {
        const safe = href && /^(https?:|mailto:)/i.test(href) ? href : undefined;
        if (!safe) return <span>{children}</span>;
        return (
            <a href={safe} target="_blank" rel="noreferrer" className="underline">
                {children}
            </a>
        );
    },
    h1: ({ children }) => <p className="mb-1 mt-0 font-semibold text-text-900">{children}</p>,
    h2: ({ children }) => <p className="mb-1 mt-0 font-semibold text-text-900">{children}</p>,
    h3: ({ children }) => <p className="mb-1 mt-0 font-semibold text-text-900">{children}</p>,
    h4: ({ children }) => <p className="mb-1 mt-0 font-semibold text-text-900">{children}</p>,
    h5: ({ children }) => <p className="mb-1 mt-0 font-semibold text-text-900">{children}</p>,
    h6: ({ children }) => <p className="mb-1 mt-0 font-semibold text-text-900">{children}</p>,
};

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
            ) : isUser ? (
                <>
                    <p
                        ref={textRef}
                        className={`mb-0 mt-0 whitespace-pre-wrap break-words text-white ${!expanded ? 'line-clamp-5' : ''}`}
                    >
                        {children}
                    </p>
                    {overflows && (
                        <button
                            type="button"
                            onClick={() => setExpanded((open) => !open)}
                            className="mt-2 cursor-pointer text-xs font-medium text-white underline decoration-white/70"
                        >
                            {expanded ? 'Show less' : 'Show more'}
                        </button>
                    )}
                </>
            ) : (
                <div className="break-words text-xs text-text-700 md:text-sm [&_ol]:mb-2 [&_ol]:list-decimal [&_ol]:pl-4 [&_p]:mb-2 [&_p]:mt-0 [&_p]:text-xs [&_p]:text-text-700 md:[&_p]:text-sm [&_p:last-child]:mb-0 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-surface [&_pre]:p-2 [&_ul]:mb-2 [&_ul]:list-disc [&_ul]:pl-4 [&_code]:rounded [&_code]:bg-surface [&_code]:px-1">
                    <ReactMarkdown components={agentMarkdownComponents}>
                        {children}
                    </ReactMarkdown>
                </div>
            )}
        </div>
    );
}
