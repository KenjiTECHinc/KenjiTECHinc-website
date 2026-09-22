import { useEffect, useRef } from 'react';
import { ChatMessage } from '../molecules/ChatMessage';
import { ChatComposer } from '../molecules/ChatComposer';
import type { ChatTurn } from '../../lib/chatClient';

interface ChatPanelProps {
    messages: ChatTurn[];
    isPending: boolean;
    error: string | null;
    onSend: (text: string) => void;
}

export function ChatPanel({
    messages,
    isPending,
    error,
    onSend,
}: ChatPanelProps) {
    const transcriptRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const node = transcriptRef.current;
        if (!node) return;
        node.scrollTop = node.scrollHeight;
    }, [messages, isPending]);

    return (
        <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-border-200 bg-white shadow-lg">
            <div
                ref={transcriptRef}
                className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto bg-white p-4"
            >
                {messages.length === 0 && !isPending ? (
                    <div className="m-auto max-w-md text-center">
                        <h6>Ask the agent</h6>
                        <p>
                            I can talk through the projects on this site — what they are,
                            why they were built, and live GitHub details when available.
                        </p>
                    </div>
                ) : (
                    messages.map((message, index) => (
                        <ChatMessage
                            key={`${message.role}-${index}`}
                            role={message.role}
                            text={message.text}
                        />
                    ))
                )}

                {isPending && (
                    <ChatMessage role="model" text="" isTyping />
                )}
            </div>

            {error && (
                <p className="mb-0 border-t border-error-100 bg-error-100 px-4 py-2 text-error-700" role="alert">
                    {error}
                </p>
            )}

            <ChatComposer disabled={isPending} onSend={onSend} />
        </div>
    );
}
