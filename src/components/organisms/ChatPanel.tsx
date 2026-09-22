import { useEffect, useRef, useState } from 'react';
import { ChatMessage } from '../molecules/ChatMessage';
import { ChatComposer } from '../molecules/ChatComposer';
import type { ChatPrefill } from '../molecules/ChatComposer';
import { ChatSuggestionList } from '../molecules/ChatSuggestionList';
import { STARTER_SUGGESTIONS } from '../../lib/chatSuggestions';
import type { ChatSuggestion } from '../../lib/chatSuggestions';
import type { ChatTurn } from '../../lib/chatClient';

interface ChatPanelProps {
    messages: ChatTurn[];
    suggestions: string[];
    isPending: boolean;
    error: string | null;
    onSend: (text: string) => void;
}

export function ChatPanel({
    messages,
    suggestions,
    isPending,
    error,
    onSend,
}: ChatPanelProps) {
    const transcriptRef = useRef<HTMLDivElement>(null);
    const prefillId = useRef(0);
    const [prefill, setPrefill] = useState<ChatPrefill | null>(null);

    useEffect(() => {
        const node = transcriptRef.current;
        if (!node) return;
        node.scrollTop = node.scrollHeight;
    }, [messages, isPending]);

    const chips: ChatSuggestion[] = isPending
        ? []
        : messages.length === 0
            ? STARTER_SUGGESTIONS
            : suggestions.map((text) => ({ label: text, prompt: text }));

    const selectSuggestion = (prompt: string) => {
        prefillId.current += 1;
        setPrefill({ id: prefillId.current, text: prompt });
    };

    return (
        <div className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden rounded-2xl border border-border-200 bg-white shadow-lg">
            <div className="relative flex min-h-0 min-w-0 flex-1 flex-col">
            <div
                ref={transcriptRef}
                className={`flex min-h-0 min-w-0 flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto bg-white p-4 ${chips.length > 0 ? 'md:pb-24' : ''}`}
            >
                {messages.length === 0 && !isPending ? (
                    <div className="m-auto max-w-md text-center">
                        <p>
                            Ask about the projects on this site. I can explain what they are,
                            why they were built, and pull live GitHub details when a repo is linked.
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

            <ChatSuggestionList
                suggestions={chips}
                disabled={isPending}
                onSelect={selectSuggestion}
            />
            </div>

            {error && (
                <p className="mb-0 border-t border-error-100 bg-error-100 px-4 py-2 text-error-700" role="alert">
                    {error}
                </p>
            )}

            <ChatComposer disabled={isPending} prefill={prefill} onSend={onSend} />
        </div>
    );
}
