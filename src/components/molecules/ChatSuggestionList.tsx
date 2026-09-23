import type { ChatSuggestion } from '../../lib/chatSuggestions';

interface ChatSuggestionListProps {
    suggestions: ChatSuggestion[];
    disabled?: boolean;
    onSelect: (prompt: string) => void;
}

export function ChatSuggestionList({
    suggestions,
    disabled = false,
    onSelect,
}: ChatSuggestionListProps) {
    if (suggestions.length === 0) return null;

    return (
        <div className="absolute inset-x-0 bottom-0 z-10 hidden gap-4 overflow-x-auto bg-transparent px-4 py-4 md:flex">
            {suggestions.map((suggestion, index) => (
                <button
                    key={`${suggestion.label}-${index}`}
                    type="button"
                    disabled={disabled}
                    onClick={() => onSelect(suggestion.prompt)}
                    className="shrink-0 cursor-pointer whitespace-nowrap rounded-lg border border-border-200 bg-white px-3 py-2 text-left text-xs text-text-700 shadow-sm transition-colors hover:border-primary-550 hover:text-primary-550 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                >
                    {suggestion.label}
                </button>
            ))}
        </div>
    );
}
