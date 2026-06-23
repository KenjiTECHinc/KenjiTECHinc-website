// src/context/ProjectsContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const ProjectsContext = createContext();

export function ProjectsProvider({ children }) {
    const [projectsData, setProjectsData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hasFetched, setHasFetched] = useState(false);

    useEffect(() => {
        // If we already fetched data once during this session, stop here.
        if (hasFetched) return;

        async function fetchProjects() {
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error("Error fetching projects:", error);
                setIsLoading(false);
                return;
            }

            const groupedObj = data.reduce((acc, project) => {
                const year = project.year.toString();
                if (!acc[year]) acc[year] = [];
                acc[year].push(project);
                return acc;
            }, {});

            const formattedArray = Object.entries(groupedObj)
                .map(([year, projectsArray]) => ({
                    year: year,
                    projects: projectsArray
                }))
                .sort((a, b) => Number(b.year) - Number(a.year));

            setProjectsData(formattedArray);
            setHasFetched(true);
            setIsLoading(false);
        }

        fetchProjects();
    }, [hasFetched]);

    return (
        <ProjectsContext.Provider value={{ projectsData, isLoading }}>
            {children}
        </ProjectsContext.Provider>
    );
}

export function useProjects() {
    const context = useContext(ProjectsContext);

    if (!context) {
        throw new Error("useProjects must be used inside a ProjectsProvider layout wrapper.");
    }

    return context;
}