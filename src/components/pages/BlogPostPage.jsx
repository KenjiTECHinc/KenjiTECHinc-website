// src/components/pages/BlogPostPage.jsx
import { InternalLinkButton } from '../atoms/InternalLinkButton';
import FirstPost from '../../data/posts/github-education.mdx';

const customMdxComponents = {
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
        <ul className="pl-4 space-y-2 my-4
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
    return (
        <div className="min-h-screen bg-surface py-16 px-4 sm:px-6 lg:px-8 flex flex-col items-center">

            <div className="w-full max-w-3xl mb-8">
                <InternalLinkButton to="/" label="Back to Home">
                    ← Back to Home
                </InternalLinkButton>
            </div>

            {/* Tailwind's 'prose' class still styles all the standard Markdown elements perfectly */}
            <article className="prose prose-lg prose-slate max-w-3xl w-full bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-border-200">

                {/* Render the MDX just like any other React component */}
                <FirstPost components={customMdxComponents} />

            </article>

        </div>
    );
}