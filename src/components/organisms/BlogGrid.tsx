import { useCallback, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { BlogCard } from '../molecules/BlogCard';
import { BlogPreviewModal } from './BlogPreviewModal';
import type { BlogEntry } from '../../data/blogs';
import { saveBlogsScrollPosition } from '../../lib/blogScroll';

interface BlogGridProps {
    blogs: BlogEntry[];
}

export function BlogGrid({ blogs }: BlogGridProps) {
    const location = useLocation();
    const [activeYear, setActiveYear] = useState('All');
    const [selectedBlog, setSelectedBlog] = useState<BlogEntry | null>(null);
    const closePreview = useCallback(() => setSelectedBlog(null), []);
    const saveScrollPosition = useCallback(
        () => saveBlogsScrollPosition(location.key),
        [location.key],
    );
    const sortedBlogs = [...blogs].sort(
        (a, b) => b.publishedAt.localeCompare(a.publishedAt),
    );
    const years = [...new Set(
        sortedBlogs.map((blog) => blog.publishedAt.slice(0, 4)),
    )].sort((a, b) => Number(b) - Number(a));
    const visibleYears = activeYear === 'All'
        ? years
        : years.filter((year) => year === activeYear);

    if (blogs.length === 0) {
        return (
            <p className="mt-8 text-center">
                No blog posts are available yet. Please check back later!
            </p>
        );
    }

    return (
        <>
            <div className="mb-12 flex flex-wrap justify-center gap-4">
                {['All', ...years].map((year) => (
                    <button
                        key={year}
                        type="button"
                        onClick={() => setActiveYear(year)}
                        className={`cursor-pointer rounded-full px-4 py-2 text-xs font-medium transition-all duration-100 ease-in-out md:text-sm ${
                            activeYear === year
                                ? 'scale-105 bg-primary-550 text-white shadow-md'
                                : 'border border-border-200 bg-white text-text-700 hover:scale-105 hover:bg-border-100 hover:text-text-900'
                        }`}
                    >
                        {year}
                    </button>
                ))}
            </div>

            <div className="space-y-16">
                {visibleYears.map((year) => {
                    const blogsForYear = sortedBlogs.filter(
                        (blog) => blog.publishedAt.startsWith(year),
                    );

                    return (
                        <section key={year}>
                            <div className="mb-6 flex items-center">
                                <h4 className="mr-4">{year}</h4>
                                <div className="h-px grow bg-border-200" />
                            </div>

                            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
                                {blogsForYear.map((blog) => (
                                    <BlogCard
                                        key={blog.slug}
                                        blog={blog}
                                        onPreview={setSelectedBlog}
                                        onRead={saveScrollPosition}
                                    />
                                ))}
                            </div>
                        </section>
                    );
                })}
            </div>

            <BlogPreviewModal
                blog={selectedBlog}
                onClose={closePreview}
                onContinue={saveScrollPosition}
            />
        </>
    );
}
