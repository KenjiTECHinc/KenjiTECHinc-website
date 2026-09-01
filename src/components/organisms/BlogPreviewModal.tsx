import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { InternalLinkButton } from '../atoms/InternalLinkButton';
import { BlogMeta } from '../molecules/BlogMeta';
import type { BlogEntry } from '../../data/blogs';
import { BLOG_NAVIGATION_STATE } from '../../lib/blogScroll';

interface BlogPreviewModalProps {
    blog: BlogEntry | null;
    onClose: () => void;
    onContinue: () => void;
}

export function BlogPreviewModal({
    blog,
    onClose,
    onContinue,
}: BlogPreviewModalProps) {
    const dialogRef = useRef<HTMLElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (!blog) return;

        const previouslyFocused = document.activeElement instanceof HTMLElement
            ? document.activeElement
            : null;
        const previousOverflow = document.body.style.overflow;

        document.body.style.overflow = 'hidden';
        closeButtonRef.current?.focus();

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
                return;
            }

            if (event.key !== 'Tab' || !dialogRef.current) return;

            const focusableElements = Array.from(
                dialogRef.current.querySelectorAll<HTMLElement>(
                    'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
                ),
            );
            const firstElement = focusableElements[0];
            const lastElement = focusableElements.at(-1);

            if (event.shiftKey && document.activeElement === firstElement) {
                event.preventDefault();
                lastElement?.focus();
            } else if (!event.shiftKey && document.activeElement === lastElement) {
                event.preventDefault();
                firstElement?.focus();
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener('keydown', handleKeyDown);
            previouslyFocused?.focus();
        };
    }, [blog, onClose]);

    if (!blog) return null;

    const titleId = `blog-preview-title-${blog.slug}`;
    const descriptionId = `blog-preview-description-${blog.slug}`;

    return createPortal(
        <div
            role="presentation"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) onClose();
            }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm"
        >
            <section
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                aria-describedby={descriptionId}
                className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border-200 bg-white p-6 shadow-xl md:p-10"
            >
                <button
                    ref={closeButtonRef}
                    type="button"
                    onClick={onClose}
                    aria-label="Close blog preview"
                    className="absolute right-4 top-4 cursor-pointer rounded-full p-2 text-text-500 transition-colors hover:bg-border-100 hover:text-text-900 focus-visible:outline-2 focus-visible:outline-primary-600"
                >
                    <X aria-hidden="true" className="h-5 w-5" />
                </button>

                <div className="pr-10">
                    <h4 id={titleId}>{blog.title}</h4>
                    <p className="font-mono font-medium text-text-500">{blog.subtitle}</p>
                </div>

                <BlogMeta
                    publishedAt={blog.publishedAt}
                    readMinutes={blog.readMinutes}
                    className="my-6"
                />

                <div className="rounded-xl border border-border-100 bg-surface p-5">
                    <h5>TL;DR</h5>
                    <p id={descriptionId}>{blog.tldr}</p>
                </div>

                <div className="mt-6 flex flex-wrap justify-end gap-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="m-1 cursor-pointer rounded-lg border-2 border-primary-550 bg-transparent px-6 py-2 text-xs font-medium text-primary-550 shadow-sm transition-all hover:bg-primary-100 md:text-sm"
                    >
                        Close
                    </button>
                    <InternalLinkButton
                        to={blog.route}
                        state={BLOG_NAVIGATION_STATE}
                        onClick={onContinue}
                        label={`Continue reading ${blog.title}`}
                    >
                        Continue Reading
                    </InternalLinkButton>
                </div>
            </section>
        </div>,
        document.body,
    );
}
