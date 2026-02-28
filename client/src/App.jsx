import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Listings from "./pages/Listings";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreateListing from "./pages/CreateListing";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/"        element={<Home />} />
              <Route path="/listings" element={<Listings />} />
              <Route path="/login"   element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/create"  element={<ProtectedRoute><CreateListing /></ProtectedRoute>} />
              <Route path="*"        element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <footer className="border-t border-brd py-6 text-center text-xs font-mono text-ink-4">
            © {new Date().getFullYear()} ListHub
          </footer>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
