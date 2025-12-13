import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';

import Footer from './components/Footer';
import Hackathons from './pages/Hackathons';
import AddHackathon from './pages/AddHackathon';
import HackathonDetails from './pages/HackathonDetails'; // Added for /hackathons/:id route
import Sessions from './pages/Sessions';
import AddSession from './pages/AddSession';
import SessionDetails from './pages/SessionDetails';

import Mentorship from './pages/Mentorship';
import BookMentor from './pages/BookMentor';

import AdminDashboard from './pages/AdminDashboard';
import AdminApprovals from './pages/AdminApprovals';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import MyEvents from './pages/MyEvents';

import Chat from './components/Chat';
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen relative overflow-hidden bg-dark-bg text-white flex flex-col">
          {/* Background Glow Effects */}
          <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-neon-purple/20 blur-[120px] rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2" />
          <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-neon-blue/20 blur-[120px] rounded-full pointer-events-none translate-x-1/2 translate-y-1/2" />

          <Navbar />
          <AppRoutes />
          <div className="relative z-10 px-4 py-8 max-w-7xl mx-auto flex-grow w-full">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/hackathons" element={<Hackathons />} />
              <Route path="/hackathons/add" element={<AddHackathon />} />
              <Route path="/hackathons/:id" element={<HackathonDetails />} />
              <Route path="/sessions" element={<Sessions />} />
              <Route path="/sessions/add" element={<AddSession />} />
              <Route path="/sessions/:id" element={<SessionDetails />} />
              <Route path="/mentorship" element={<Mentorship />} />
              <Route path="/mentorship/book/:id" element={<BookMentor />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/approvals" element={<AdminApprovals />} />
              <Route path="/my-events" element={<MyEvents />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/profile/edit" element={<EditProfile />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
