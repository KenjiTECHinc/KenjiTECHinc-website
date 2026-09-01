import { InternalLinkButton } from '../atoms/InternalLinkButton';
import { Footer } from '../molecules/Footer';
import { ProjectsGrid } from '../organisms/ProjectsGrid';
import projectsData from '../../data/projects.json';
import { useScrollToTop } from '../../hooks/useScrollToTop';

export function ProjectsPage() {
    useScrollToTop();

    return (
        <div className="min-h-screen flex flex-col">
            <main className="grow">
                <section className="flex flex-col items-center py-16 px-6 sm:px-4 lg:px-6 bg-surface/50">
                    <div className="w-full max-w-7xl">
                        <InternalLinkButton to="/" variant="outline" label="Return to Home">
                            ← Return to Home
                        </InternalLinkButton>

                        <h3 className="mt-8 text-center">
                            Projects 🏗️
                        </h3>

                        {projectsData.length === 0 ? (
                            <p className="mt-4 text-center text-gray-600">
                                No projects to display at the moment. Please check back later!
                            </p>
                        ) : (
                            <ProjectsGrid groupedProjects={projectsData} />
                        )}
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
