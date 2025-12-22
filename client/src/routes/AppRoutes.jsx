import { Routes, Route } from "react-router-dom";

// Pages
import Home from "../pages/Home";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import VoiceInterview from "../pages/VoiceInterview";

import Hackathons from "../pages/Hackathons";
import AddHackathon from "../pages/AddHackathon";
import HackathonDetails from "../pages/HackathonDetails";

import Sessions from "../pages/Sessions";
import AddSession from "../pages/AddSession";
import SessionDetails from "../pages/SessionDetails";

import Mentorship from "../pages/Mentorship";
import BookMentor from "../pages/BookMentor";

import AdminDashboard from "../pages/AdminDashboard";
import AdminApprovals from "../pages/AdminApprovals";

import Profile from "../pages/Profile";
import EditProfile from "../pages/EditProfile";
import MyEvents from "../pages/MyEvents";

import Chat from "../components/Chat";

export default function AppRoutes() {
  return (
    <Routes>
      {/* PUBLIC */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* AI FEATURES */}
      <Route path="/chat" element={<Chat />} />
      <Route path="/voice-interview" element={<VoiceInterview />} />

      {/* HACKATHONS */}
      <Route path="/hackathons" element={<Hackathons />} />
      <Route path="/hackathons/add" element={<AddHackathon />} />
      <Route path="/hackathons/:id" element={<HackathonDetails />} />

      {/* SESSIONS */}
      <Route path="/sessions" element={<Sessions />} />
      <Route path="/sessions/add" element={<AddSession />} />
      <Route path="/sessions/:id" element={<SessionDetails />} />

      {/* MENTORSHIP */}
      <Route path="/mentorship" element={<Mentorship />} />
      <Route path="/mentorship/book/:id" element={<BookMentor />} />

      {/* ADMIN */}
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/approvals" element={<AdminApprovals />} />

      {/* USER */}
      <Route path="/profile" element={<Profile />} />
      <Route path="/profile/edit" element={<EditProfile />} />
      <Route path="/my-events" element={<MyEvents />} />
    </Routes>
  );
}
