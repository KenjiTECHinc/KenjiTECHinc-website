import { useLayoutEffect } from 'react';

export function useScrollToTop(): void {
    useLayoutEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }, []);
}
