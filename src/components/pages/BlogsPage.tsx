import { useLayoutEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';
import { InternalLinkButton } from '../atoms/InternalLinkButton';
import { Footer } from '../molecules/Footer';
import { BlogGrid } from '../organisms/BlogGrid';
import { blogs } from '../../data/blogs';
import { consumeBlogsScrollPosition } from '../../lib/blogScroll';

export function BlogsPage() {
    const location = useLocation();
    const navigationType = useNavigationType();

    useLayoutEffect(() => {
        const scrollY = consumeBlogsScrollPosition(location.key);

        if (navigationType !== 'POP' || scrollY === null) {
            window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
            return;
        }

        const animationFrame = requestAnimationFrame(() => {
            window.scrollTo({ top: scrollY, left: 0, behavior: 'auto' });
        });

        return () => cancelAnimationFrame(animationFrame);
    }, [location.key, navigationType]);

    return (
        <div className="min-h-screen bg-surface">
            <main className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <InternalLinkButton to="/" variant="outline" label="Return to Home">
                    ← Return to Home
                </InternalLinkButton>

                <section className="py-10">
                    <h3 className="text-center">The Great&apos;s Blogs 📝</h3>

                    <BlogGrid blogs={blogs} />
                </section>
            </main>
            <Footer />
        </div>
    );
}
