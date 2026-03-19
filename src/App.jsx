import { useState } from 'react'
import './index.css'
import { ProjectsGrid } from './components/organisms/ProjectsGrid';
import { ButtonCollection } from './components/molecules/ButtonCollection';
import { Footer } from './components/molecules/Footer';

import projectsData from './data/projects.json';
import connectData from './data/connect.json';


function App() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center font-sans">
      <section className="flex flex-col justify-center items-center min-h-screen py-16 px-6 text-center">
        <h1 >
          Hi, I'm Kenji 👋
        </h1>
        <h2>
          Welcome to my personal website!
        </h2>

        <h5>Just looking to connect? 🤝</h5>
        <ButtonCollection buttons={connectData} />

        <hr className="border-gray-900 my-6 h-1 w-1/2" />

        {/* Button */}
        <button
          onClick={() => alert("Thanks for visiting! This site is under construction.")}
          className="mt-8 mb-8 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg shadow-sm transition-all duration-300 transform hover:scale-105 cursor-pointer"
        >
          Say Hello
        </button>
      </section>

      <div className="w-full flex justify-center">
        <hr className="w-1/2 border-t-2 border-border-200" />
      </div>

      {/* Projects Display */}
      <section className="flex flex-col items-center justify-center py-16 px-6 sm:px-4 lg:px-6 bg-surface/50">
        <h3>
          Projects 🏗️
        </h3>
        <ProjectsGrid groupedProjects={projectsData} />
      </section>

      <Footer />
    </div>
  )
}

export default App