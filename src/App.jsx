import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from './components/pages/HomePage';
import { AgentPage } from './components/pages/AgentPage';
import { BlogPostPage } from './components/pages/BlogPostPage';

function App() {
  return (
    // The Router acts as the wrapper for the entire app
    <Router>
      <div className="bg-white font-sans">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/agent" element={<AgentPage />} />
          <Route path="/blog/first-post" element={<BlogPostPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;