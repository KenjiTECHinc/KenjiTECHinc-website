// src/components/pages/BlogPostPage.tsx
import type { MDXComponents } from 'mdx/types';
import { useLayoutEffect } from 'react';
import type { MouseEventHandler } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { InternalLinkButton } from '../atoms/InternalLinkButton';
import { Footer } from '../molecules/Footer';
import { getBlogBySlug } from '../../data/blogs';
import type { BlogNavigationState } from '../../lib/blogScroll';

const customMdxComponents: MDXComponents = {
    a: (props) => (
        <a
            {...props}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs md:text-sm 2xl:text-base text-text-600 underline underline-offset-2 hover:text-text-900 transition-colors"
        >
            {props.children}
        </a>
    ),
    // Add styling to the <ul> wrapper
    ul: (props) => (
        <ul className="list-none pl-4 space-y-2 my-4
                [&>li]:relative [&>li]:pl-8 
                [&>li::before]:content-['🚀'] [&>li::before]:absolute [&>li::before]:left-0 [&>li::before]:top-0 
                text-text-600 text-xs md:text-sm 2xl:text-base">
            {props.children}
        </ul>
    ),
    ol: (props) => (
        <ol className="list-decimal list-inside pl-4 space-y-2 my-4 
                text-text-600 marker:text-text-600 marker:font-bold 
                text-xs md:text-sm 2xl:text-base">
            {props.children}
        </ol>
    ),
};

export function BlogPostPage() {
    const { slug } = useParams<{ slug: string }>();
    const location = useLocation();
    const navigate = useNavigate();
    const blog = getBlogBySlug(slug);
    const navigationState = location.state as BlogNavigationState | null;

    useLayoutEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }, [slug]);

    const handleBackToBlogs: MouseEventHandler<HTMLAnchorElement> = (event) => {
        if (!navigationState?.fromBlogs) return;

        event.preventDefault();
        navigate(-1);
    };

    if (!blog) {
        return (
            <div className="flex min-h-screen flex-col bg-surface">
                <main className="flex grow items-center justify-center px-4 py-16">
                    <section className="w-full max-w-xl rounded-2xl border border-border-200 bg-white p-8 text-center shadow-sm">
                        <h3>Blog Not Found</h3>
                        <p className="mb-6">
                            This blog post does not exist or may have moved.
                        </p>
                        <InternalLinkButton
                            to="/blogs"
                            variant="outline"
                            onClick={handleBackToBlogs}
                            label="Return to Blogs"
                        >
                            ← Return to Blogs
                        </InternalLinkButton>
                    </section>
                </main>
                <Footer />
            </div>
        );
    }

    const { Content } = blog;

    return (
        <div className="min-h-screen bg-surface py-16 px-4 sm:px-6 lg:px-8 flex flex-col items-center">

            <div className="w-full max-w-3xl mb-8">
                <InternalLinkButton
                    to="/blogs"
                    variant="outline"
                    onClick={handleBackToBlogs}
                    label="Back to Blogs"
                >
                    ← Back to Blogs
                </InternalLinkButton>
            </div>

            {/* Tailwind's 'prose' class still styles all the standard Markdown elements perfectly */}
            <article className="prose prose-lg prose-slate max-w-3xl w-full bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-border-200">

                {/* Render the MDX just like any other React component */}
                <Content components={customMdxComponents} />

            </article>

        </div>
    );
}