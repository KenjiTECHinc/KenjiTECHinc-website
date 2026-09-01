import type { ComponentType } from 'react';
import type { MDXProps } from 'mdx/types';

export interface BlogMetadata {
    slug: string;
    title: string;
    subtitle: string;
    publishedAt: string;
    readMinutes: number;
    tldr: string;
    coverImage: string | null;
    coverAlt: string;
}

export interface BlogEntry extends BlogMetadata {
    Content: ComponentType<MDXProps>;
    route: string;
}

interface BlogModule {
    default: ComponentType<MDXProps>;
    metadata: unknown;
}

function isBlogMetadata(value: unknown): value is BlogMetadata {
    if (!value || typeof value !== 'object') return false;

    const metadata = value as Record<string, unknown>;

    return (
        typeof metadata.slug === 'string'
        && typeof metadata.title === 'string'
        && typeof metadata.subtitle === 'string'
        && typeof metadata.publishedAt === 'string'
        && typeof metadata.readMinutes === 'number'
        && typeof metadata.tldr === 'string'
        && (metadata.coverImage === null || typeof metadata.coverImage === 'string')
        && typeof metadata.coverAlt === 'string'
    );
}

const modules = import.meta.glob<BlogModule>('./posts/*.mdx', { eager: true });
const seenSlugs = new Set<string>();

export const blogs: BlogEntry[] = Object.entries(modules)
    .map(([filePath, blogModule]) => {
        if (!isBlogMetadata(blogModule.metadata)) {
            throw new Error(`Blog metadata is missing or invalid in ${filePath}.`);
        }

        if (seenSlugs.has(blogModule.metadata.slug)) {
            throw new Error(`Duplicate blog slug: ${blogModule.metadata.slug}.`);
        }

        seenSlugs.add(blogModule.metadata.slug);

        return {
            ...blogModule.metadata,
            Content: blogModule.default,
            route: `/blog/${blogModule.metadata.slug}`,
        };
    })
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

export function getBlogBySlug(slug: string | undefined): BlogEntry | undefined {
    return blogs.find((blog) => blog.slug === slug);
}

export function formatBlogDate(publishedAt: string): string {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC',
    }).format(new Date(`${publishedAt}T00:00:00Z`));
}
