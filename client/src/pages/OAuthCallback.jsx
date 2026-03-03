/**
 * OAuthCallback.jsx
 * Landing page after Google OAuth redirect.
 * Extracts token from URL, saves it, redirects to listings.
 */
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

export default function OAuthCallback() {
  const [params]    = useSearchParams();
  const { loginUser } = useAuth();
  const navigate      = useNavigate();

  useEffect(() => {
    const token = params.get("token");
    const error = params.get("error");

    if (error || !token) {
      navigate("/login?error=oauth_failed");
      return;
    }

    // Save token first so axios can use it
    localStorage.setItem("token", token);

    // Fetch user info
    api.get("/auth/me")
      .then(({ data }) => {
        loginUser(data.user, token);
        navigate("/listings");
      })
      .catch(() => {
        localStorage.removeItem("token");
        navigate("/login?error=oauth_failed");
      });
  }, []);

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-ink-3 text-sm font-mono">Signing you in with Google…</p>
      </div>
    </div>
  );
}
