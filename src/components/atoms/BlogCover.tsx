import { BookOpenText } from 'lucide-react';

interface BlogCoverProps {
    coverImage: string | null;
    coverAlt: string;
    title: string;
}

export function BlogCover({ coverImage, coverAlt, title }: BlogCoverProps) {
    return (
        <div className="h-52 w-full overflow-hidden bg-primary-100">
            {coverImage ? (
                <img
                    src={coverImage}
                    alt={coverAlt}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
            ) : (
                <div
                    role="img"
                    aria-label={`${title} cover placeholder`}
                    className="flex h-full w-full flex-col items-center justify-center gap-3 bg-linear-to-br from-primary-100 via-white to-contrast-100 px-6 text-center"
                >
                    <BookOpenText
                        aria-hidden="true"
                        className="h-12 w-12 text-primary-600"
                        strokeWidth={1.5}
                    />
                    <span className="font-mono text-sm font-semibold text-text-700">
                        The Great&apos;s Blogs
                    </span>
                </div>
            )}
        </div>
    );
}
