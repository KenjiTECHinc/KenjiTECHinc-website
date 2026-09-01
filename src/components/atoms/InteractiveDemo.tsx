// src/components/atoms/InteractiveDemo.tsx
import { useState } from 'react';

export function InteractiveDemo() {
    const [count, setCount] = useState(0);

    return (
        <div className="p-4 my-6 bg-blue-50 border border-blue-200 rounded-lg text-center">
            <h4 className="text-blue-800 font-bold mb-2 mt-0">React Component Inside Markdown!</h4>
            <button
                onClick={() => setCount(c => c + 1)}
                className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
            >
                Clicked {count} times
            </button>
        </div>
    );
}