import { ButtonCollection } from '../molecules/ButtonCollection';
import { InternalLinkButton } from '../atoms/InternalLinkButton';
import { ScrollIndicator } from '../atoms/ScrollIndicator';
import { ProjectsGrid } from '../organisms/ProjectsGrid';
import { Footer } from '../molecules/Footer';

import projectsData from '../../data/projects.json';
import connectData from '../../data/connect.json';


export function HomePage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <main>
                <section className="flex flex-col justify-center items-center min-h-screen py-16 px-6 text-center">
                    <h1 >
                        Hi, I'm Kenji 👋
                    </h1>
                    <h2>
                        Welcome to my personal website!
                    </h2>

                    {/* Networking buttons */}
                    <h5>Just looking to connect? 🤝</h5>
                    <ButtonCollection buttons={connectData} />

                    <hr className="border-gray-900 my-6 h-1 w-1/2" />

                    {/* Routing */}
                    <InternalLinkButton to="/agent" label="Visit Agent Page">
                        Visit Agent 🤖
                    </InternalLinkButton>

                    <p className='mt-5 font-semibold'>
                        This website is constantly under development, so expect new features and updates in the future! 🚀
                    </p>
                    <ScrollIndicator targetId="projects-section" />
                </section>

                <div className="w-full flex justify-center">
                    <hr className="w-1/2 border-t-2 border-border-200" />
                </div>

                {/* Projects display */}
                <section id="projects-section" className="flex flex-col items-center justify-center py-16 px-6 sm:px-4 lg:px-6 bg-surface/50">
                    <h3>
                        Projects 🏗️
                    </h3>
                    <ProjectsGrid groupedProjects={projectsData} />
                </section>
            </main>
            <Footer />
        </div>
    )
}