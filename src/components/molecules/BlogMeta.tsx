import { formatBlogDate } from '../../data/blogs';

interface BlogMetaProps {
    publishedAt: string;
    readMinutes: number;
    className?: string;
}

const metadataTextClasses = 'mb-1.5 mt-1 font-sans text-xs text-text-600 md:text-sm 2xl:text-base';

export function BlogMeta({
    publishedAt,
    readMinutes,
    className = '',
}: BlogMetaProps) {
    return (
        <div className={`flex items-center divide-x divide-border-200 ${className}`}>
            <time
                dateTime={publishedAt}
                className={`${metadataTextClasses} pr-3`}
            >
                {formatBlogDate(publishedAt)}
            </time>
            <span className={`${metadataTextClasses} pl-3`}>
                {readMinutes} min read
            </span>
        </div>
    );
}
