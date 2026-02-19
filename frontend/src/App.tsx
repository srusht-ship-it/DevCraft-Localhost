import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Team from './pages/Team';
import ComplaintForm from './components/ComplaintForm';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <Link to="/" className="logo">🏛️ CivicSense</Link>
          <div className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/submit">Submit Complaint</Link>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/team">Our Team</Link>
          </div>
        </nav>
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/submit" element={<ComplaintForm />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/team" element={<Team />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
