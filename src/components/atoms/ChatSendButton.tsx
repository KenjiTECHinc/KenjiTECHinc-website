interface ChatSendButtonProps {
    disabled?: boolean;
}

export function ChatSendButton({ disabled = false }: ChatSendButtonProps) {
    return (
        <button
            type="submit"
            disabled={disabled}
            aria-label="Send message"
            className="inline-flex h-11 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-primary-550 px-4 text-sm font-medium text-white shadow-sm transition-all hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
            Send
        </button>
    );
}
