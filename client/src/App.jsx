import { BrowserRouter as Router } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from "./context/AuthContext";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
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

          <Toaster
            position="top-right"
            toastOptions={{
              className: '',
              style: {
                background: 'rgba(20, 20, 30, 0.9)',
                color: '#fff',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
              },
              success: {
                iconTheme: {
                  primary: '#39FF14',
                  secondary: 'black',
                },
              },
              error: {
                iconTheme: {
                  primary: '#FF073A',
                  secondary: 'black',
                },
              },
            }}
          />

          {/* ALL ROUTES LIVE HERE */}
          <main className="relative z-10 px-4 py-8 max-w-7xl mx-auto flex-grow w-full">
            <AppRoutes />
          </main>

          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
