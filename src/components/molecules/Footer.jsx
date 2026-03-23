// src/components/molecules/Footer.jsx

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="py-8 w-full bg-primary-550 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">

                <p className="text-xs text-white md:text-sm">
                    © {currentYear} Kenji. All rights reserved.
                </p>

                <p className="text-xs text-white mt-2">
                    Designed and built with love 🥰.
                </p>

            </div>
        </footer>
    );
}