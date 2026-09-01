import { BlogCover } from '../atoms/BlogCover';
import { InternalLinkButton } from '../atoms/InternalLinkButton';
import { BlogMeta } from './BlogMeta';
import type { BlogEntry } from '../../data/blogs';
import { BLOG_NAVIGATION_STATE } from '../../lib/blogScroll';

interface BlogCardProps {
    blog: BlogEntry;
    onPreview: (blog: BlogEntry) => void;
    onRead: () => void;
}

export function BlogCard({ blog, onPreview, onRead }: BlogCardProps) {
    return (
        <article className="group relative flex min-h-[28rem] flex-col overflow-hidden rounded-2xl border border-border-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
            <BlogCover
                coverImage={blog.coverImage}
                coverAlt={blog.coverAlt}
                title={blog.title}
            />

            <div className="flex grow flex-col px-6 py-5">
                <h5>{blog.title}</h5>
                <p className="grow text-text-500">{blog.subtitle}</p>

                <BlogMeta
                    publishedAt={blog.publishedAt}
                    readMinutes={blog.readMinutes}
                    className="mt-4"
                />
            </div>

            <button
                type="button"
                aria-label={`Preview ${blog.title}`}
                onClick={() => onPreview(blog)}
                className="absolute inset-0 z-10 cursor-pointer rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
            />

            <div className="relative z-20 px-5 pb-5">
                <InternalLinkButton
                    to={blog.route}
                    state={BLOG_NAVIGATION_STATE}
                    onClick={onRead}
                    label={`Read ${blog.title}`}
                >
                    Read Full Blog
                </InternalLinkButton>
            </div>
        </article>
    );
}
