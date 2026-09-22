import { InternalLinkButton } from '../atoms/InternalLinkButton';
import { Footer } from '../molecules/Footer';
import { ChatPanel } from '../organisms/ChatPanel';
import { useChatContext } from '../../context/chatContext';
import { useScrollToTop } from '../../hooks/useScrollToTop';

export function AgentPage() {
    useScrollToTop();
    const { messages, isPending, error, send } = useChatContext();

    return (
        <div className="flex min-h-screen flex-col bg-surface">
            <main className="mx-auto flex w-full max-w-4xl grow flex-col px-4 py-10 sm:px-6 lg:px-8">
                <div className="w-full">
                    <InternalLinkButton to="/" variant="outline" label="Return to Home">
                        ← Return to Home
                    </InternalLinkButton>
                </div>

                <section className="mt-8 flex min-h-0 grow flex-col">
                    <h3 className="text-center">
                        Smart Agent <span className="text-primary-550">System</span>
                    </h3>
                    <p className="mx-auto mb-8 max-w-2xl text-center">
                        Ask about the projects on this site. I can explain what they are,
                        why they were built, and pull live GitHub details when a repo is linked.
                    </p>

                    <div className="min-h-[28rem] grow">
                        <ChatPanel
                            messages={messages}
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
