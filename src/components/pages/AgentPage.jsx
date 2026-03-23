import { InternalLinkButton } from '../atoms/InternalLinkButton';
import { Footer } from '../molecules/Footer';

export function AgentPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <main>
                <section className="flex flex-col justify-center items-center min-h-screen py-16 px-6 text-center">
                    <h1>
                        Smart Agent <span className="text-primary-550">System</span>
                    </h1>
                    <p className='mb-5'>
                        Upcoming Feature/Project. Stay tuned for updates! 🚧
                    </p>

                    {/* The routing button to go back */}
                    <InternalLinkButton to="/" variant="outline" label="Return to Home">
                        ← Return to Home
                    </InternalLinkButton>
                </section>
            </main>

            <Footer />
        </div>
    );
}