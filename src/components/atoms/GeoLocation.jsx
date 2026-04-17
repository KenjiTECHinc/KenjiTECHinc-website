// src/components/atoms/GeoLocation.jsx
import { useState, useEffect } from 'react';

export function GeoLocation() {
    const [location, setLocation] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Call the Vercel serverless function we just created
        fetch('../../api/geolocation')
            .then((response) => response.json())
            .then((data) => {
                setLocation(data);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error("Failed to fetch location data", error);
                setIsLoading(false);
            });
    }, []);

    // Show a tiny loading state or nothing at all while it fetches
    if (isLoading) {
        return <span className="opacity-0 transition-opacity">Loading...</span>;
    }

    return (
        <div className="inline-flex items-center px-3 py-1 mt-4 rounded-full bg-primary-50 text-primary-600 text-sm font-medium animate-fade-in">
            Hi user from {location.city}, {location.country}! 🌍
        </div>
    );
}