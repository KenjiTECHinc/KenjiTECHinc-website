import { InternalLinkButton } from '../atoms/InternalLinkButton';
import { Footer } from '../molecules/Footer';
import { ChatPanel } from '../organisms/ChatPanel';
import { useChatContext } from '../../context/chatContext';
import { useScrollToTop } from '../../hooks/useScrollToTop';

export function AgentPage() {
    useScrollToTop();
    const { messages, suggestions, isPending, error, send } = useChatContext();

    return (
        <div className="flex h-dvh flex-col overflow-hidden bg-surface">
            <main className="mx-auto flex min-h-0 w-full max-w-4xl flex-1 flex-col px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
                <div className="w-full shrink-0">
                    <InternalLinkButton to="/" variant="outline" label="Return to Home">
                        ← Return to Home
                    </InternalLinkButton>
                </div>

                <section className="mt-4 flex min-h-0 flex-1 flex-col">
                    <div className="min-h-0 flex-1">
                        <ChatPanel
                            messages={messages}
                            suggestions={suggestions}
                            isPending={isPending}
                            error={error}
                            onSend={send}
                        />
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
