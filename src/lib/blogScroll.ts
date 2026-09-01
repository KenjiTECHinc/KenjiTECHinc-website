interface SavedBlogScrollPosition {
    locationKey: string;
    scrollY: number;
}

const BLOG_SCROLL_STORAGE_KEY = 'blogs-scroll-position';

export interface BlogNavigationState {
    fromBlogs: true;
}

export const BLOG_NAVIGATION_STATE: BlogNavigationState = {
    fromBlogs: true,
};

export function saveBlogsScrollPosition(locationKey: string): void {
    const position: SavedBlogScrollPosition = {
        locationKey,
        scrollY: window.scrollY,
    };

    sessionStorage.setItem(BLOG_SCROLL_STORAGE_KEY, JSON.stringify(position));
}

export function consumeBlogsScrollPosition(
    locationKey: string,
): number | null {
    const storedPosition = sessionStorage.getItem(BLOG_SCROLL_STORAGE_KEY);

    if (!storedPosition) return null;

    sessionStorage.removeItem(BLOG_SCROLL_STORAGE_KEY);

    try {
        const position = JSON.parse(storedPosition) as SavedBlogScrollPosition;

        return position.locationKey === locationKey
            ? position.scrollY
            : null;
    } catch {
        return null;
    }
}
