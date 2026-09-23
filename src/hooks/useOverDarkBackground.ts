import { useEffect, useState } from 'react';
import type { RefObject } from 'react';

const DARK_LUMINANCE = 0.45;

function readBackground(color: string): number | null {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    if (!context) return null;

    context.clearRect(0, 0, 1, 1);
    context.fillStyle = '#0000';
    context.fillStyle = color;
    context.fillRect(0, 0, 1, 1);

    const [red, green, blue, alpha] = context.getImageData(0, 0, 1, 1).data;
    if (alpha < 153) return null;

    const channels = [red, green, blue].map((channel) => {
        const value = channel / 255;
        return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
    });

    return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

export function useOverDarkBackground(ref: RefObject<HTMLElement | null>): boolean {
    const [onDark, setOnDark] = useState(false);

    useEffect(() => {
        let frame = 0;

        const update = () => {
            const node = ref.current;
            if (!node) return;

            const { left, top, width, height } = node.getBoundingClientRect();
            const elements = document.elementsFromPoint(left + width / 2, top + height / 2);

            let dark = false;
            for (const element of elements) {
                if (element === node || node.contains(element)) continue;

                const luminance = readBackground(getComputedStyle(element).backgroundColor);
                if (luminance === null) continue;

                dark = luminance < DARK_LUMINANCE;
                break;
            }

            setOnDark(dark);
        };

        const schedule = () => {
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(update);
        };

        schedule();
        window.addEventListener('scroll', schedule, true);
        window.addEventListener('resize', schedule);

        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener('scroll', schedule, true);
            window.removeEventListener('resize', schedule);
        };
    }, [ref]);

    return onDark;
}
