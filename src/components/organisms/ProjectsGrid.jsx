// src/components/organisms/ProjectsGrid.jsx
import { useState } from 'react';
import { ProjectCard } from '../molecules/ProjectCard';

export function ProjectsGrid({ groupedProjects }) {
    const [activeFilter, setActiveFilter] = useState('All');

    const allProjectsFlat = groupedProjects.flatMap(group => group.projects);
    const uniqueSortedTags = [...new Set(allProjectsFlat.flatMap(project => project.tech_stack))].sort();
    const allTags = ['All', ...uniqueSortedTags];

    return (
        <section className="py-12 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Interactive Filter Buttons */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
                {allTags.map(tag => (
                    <button
                        key={tag}
                        onClick={() => setActiveFilter(tag)}
                        className={`px-4 py-2 rounded-full text-xs md:text-sm font-medium transition-all ease-in-out duration-100 cursor-pointer ${activeFilter === tag
                            ? 'bg-primary-550 text-white shadow-md scale-105'
                            : 'bg-surface text-text-700 hover:bg-gray-100 hover:text-text-900 border border-gray-200 hover:scale-105'
                            }`}
                    >
                        {tag}
                    </button>
                ))}
            </div>

            {/* 2. Map through the Years */}
            <div className="space-y-16">
                {groupedProjects.map((yearGroup) => {

                    // Filter projects ONLY for this specific year
                    const filteredProjectsForYear = activeFilter === 'All'
                        ? yearGroup.projects
                        : yearGroup.projects.filter(project => project.tech_stack.includes(activeFilter));

                    // Skip rendering empty year groups
                    if (filteredProjectsForYear.length === 0) {
                        return null;
                    }

                    return (
                        <div key={yearGroup.year} className="mb-12">

                            {/* Year Header */}
                            <div className="flex items-center mb-6">
                                <h4 className="mr-4">
                                    {yearGroup.year}
                                </h4>
                                <div className="grow h-px bg-border-200"></div>
                            </div>

                            {/* The Grid of Cards for this Year */}
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                                {filteredProjectsForYear.map(project => (
                                    <ProjectCard
                                        key={project.id}
                                        title={project.title}
                                        description={project.description}
                                        techStack={project.tech_stack || []}
                                        repoLink={project.repo_url}
                                    />
                                ))}
                            </div>

                        </div>
                    );
                })}
            </div>

            {/* Fallback if a filter results in NO projects across ANY year */}
            {allProjectsFlat.filter(p => activeFilter === 'All' || p.tech_stack.includes(activeFilter)).length === 0 && (
                <div className="text-center text-text-muted mt-12 w-full">
                    <p>No projects found right now.</p>
                </div>
            )}

        </section>
    );
}