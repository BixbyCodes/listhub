import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar          from "./components/Navbar";
import ProtectedRoute  from "./components/ProtectedRoute";
import Home            from "./pages/Home";
import Listings        from "./pages/Listings";
import ListingDetail   from "./pages/ListingDetail";
import Login           from "./pages/Login";
import Register        from "./pages/Register";
import CreateListing   from "./pages/CreateListing";
import OAuthCallback   from "./pages/OAuthCallback";
// Pre-warm Render backend as soon as app loads
fetch(import.meta.env.VITE_API_URL?.replace("/api", "") + "/api/health").catch(() => {});
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/"               element={<Home />} />
              <Route path="/listings"       element={<Listings />} />
              <Route path="/listings/:id"   element={<ListingDetail />} />
              <Route path="/login"          element={<Login />} />
              <Route path="/register"       element={<Register />} />
              <Route path="/auth/callback"  element={<OAuthCallback />} />
              <Route path="/create"         element={<ProtectedRoute><CreateListing /></ProtectedRoute>} />
              <Route path="*"               element={<Navigate to="/" replace />} />
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
