import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ChatProvider } from './context/ChatProvider';
import { ChatWidget } from './components/organisms/ChatWidget';
import { HomePage } from './components/pages/HomePage';
import { AgentPage } from './components/pages/AgentPage';
import { BlogPostPage } from './components/pages/BlogPostPage';
import { BlogsPage } from './components/pages/BlogsPage';
import { ProjectsPage } from './components/pages/ProjectsPage';

function App() {
  return (
    <Router>
      <ChatProvider>
        <div className="bg-white font-sans">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/agent" element={<AgentPage />} />
            <Route path="/blogs" element={<BlogsPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
          </Routes>
          <ChatWidget />
        </div>
      </ChatProvider>
    </Router>
  );
}

export default App;
