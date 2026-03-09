import { useState } from 'react'
import './index.css'
import { ProjectsGrid } from './components/organisms/ProjectsGrid';
import { ButtonCollection } from './components/molecules/ButtonCollection';

import projectsData from './data/projects.json';
import connectData from './data/connect.json';


function App() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 font-sans">

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
        className="mt-8 mb-8 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 cursor-pointer"
      >
        Say Hello
      </button>
      <h3>
        Projects 🏗️
      </h3>

      {/* Projects Display */}
      <ProjectsGrid groupedProjects={projectsData} />

    </div>
  )
}

export default App