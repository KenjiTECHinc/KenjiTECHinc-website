import { useState } from 'react'
import './index.css'

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 font-sans">

      {/* Header Card */}
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full text-center border border-gray-100">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
          Hello, I'm Kenji 👋
        </h1>
        <p className="text-lg text-gray-500 mb-6">
          Welcome to my personal corner of the internet.
        </p>

        <hr className="border-gray-200 my-6" />

        {/* Content */}
        <div className="text-left space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">About Me</h2>
          <p className="text-gray-600 leading-relaxed">
            I am a developer passionate about new technologies and integrating them to businesses! <br />
            This site is currently under construction, but feel free to explore and connect with me on social media 🚧!
          </p>
        </div>

        {/* Button */}
        <button
          onClick={() => alert("Thanks for visiting! This site is under construction.")}
          className="mt-8 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 cursor-pointer"
        >
          Say Hello
        </button>
      </div>

    </div>
  )
}

export default App