import { ButtonCollection } from '../molecules/ButtonCollection';
import { InternalLinkButton } from '../atoms/InternalLinkButton';
import { Footer } from '../molecules/Footer';

// import { useProjects } from '../../context/projectsContext';
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

                    <InternalLinkButton to="/blogs" label="View Blogs">
                        View Blogs 📝
                    </InternalLinkButton>

                    <InternalLinkButton to="/projects" label="View Projects">
                        View Projects 🏗️
                    </InternalLinkButton>

                    <p className='mt-5 font-semibold'>
                        This website is constantly under development, so expect new features and updates in the future! 🚀
                    </p>
                </section>
            </main>
            <Footer />
        </div>
    )
}
