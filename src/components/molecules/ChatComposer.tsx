import { useEffect, useState } from 'react';
import type { FormEvent, KeyboardEvent } from 'react';
import { ChatSendButton } from '../atoms/ChatSendButton';
import { CHAT_MESSAGE_MAX_LENGTH } from '../../lib/chatClient';

export interface ChatPrefill {
    id: number;
    text: string;
}

interface ChatComposerProps {
    disabled?: boolean;
    prefill: ChatPrefill | null;
    onSend: (text: string) => void;
}

export function ChatComposer({ disabled = false, prefill, onSend }: ChatComposerProps) {
    const [draft, setDraft] = useState('');
    const remaining = CHAT_MESSAGE_MAX_LENGTH - draft.length;
    const canSend = draft.trim().length > 0 && remaining >= 0 && !disabled;

    useEffect(() => {
        if (!prefill) return;
        setDraft(prefill.text.slice(0, CHAT_MESSAGE_MAX_LENGTH));
    }, [prefill]);

    const submit = (event?: FormEvent) => {
        event?.preventDefault();
        if (!canSend) return;
        onSend(draft);
        setDraft('');
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            submit();
        }
    };

    return (
        <form onSubmit={submit} className="border-t border-border-200 bg-white p-4">
            <div className="flex items-end gap-2">
                <textarea
                    value={draft}
                    onChange={(event) => setDraft(event.target.value.slice(0, CHAT_MESSAGE_MAX_LENGTH))}
                    onKeyDown={handleKeyDown}
                    disabled={disabled}
                    rows={2}
                    placeholder="Ask about a project..."
                    aria-label="Chat message"
                    className="min-w-0 w-full grow resize-none rounded-lg border border-border-200 bg-white px-3 py-2 font-sans text-xs text-text-700 outline-none focus:border-primary-550 md:text-sm"
                />
                <ChatSendButton disabled={!canSend} />
            </div>
            <p className={`mb-0 mt-2 text-right ${remaining < 80 ? 'text-error-600' : 'text-text-400'}`}>
                {remaining} characters left
            </p>
        </form>
    );
}
