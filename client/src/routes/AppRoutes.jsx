import { Routes, Route } from "react-router-dom";
import VoiceInterview from "../pages/VoiceInterview";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/voice-interview" element={<VoiceInterview />} />
    </Routes>
  );
}
