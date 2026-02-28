import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

export default function Login() {
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/listings";

  const [form, setForm]       = useState({ email: "", password: "" });
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const onSubmit = async e => {
    e.preventDefault(); setError(""); setLoading(true);
    try {
      const { data } = await api.post("/auth/login", form);
      loginUser(data.user, data.token);
      navigate(from, { replace: true });
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-16 relative">
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(129,140,248,0.05), transparent)" }} />

      <div className="w-full max-w-sm animate-fade-up relative">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent font-display font-bold text-xl mx-auto mb-4">L</div>
          <h1 className="font-display font-bold text-2xl text-white">Welcome back</h1>
          <p className="text-ink-3 text-sm mt-1">Sign in to continue</p>
        </div>

        <div className="card p-6">
          <form onSubmit={onSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl">
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                {error}
              </div>
            )}
            <div>
              <label className="label">Email</label>
              <input type="email" name="email" className="input" placeholder="you@example.com" value={form.email} onChange={onChange} required autoComplete="email" />
            </div>
            <div>
              <label className="label">Password</label>
              <input type="password" name="password" className="input" placeholder="••••••••" value={form.password} onChange={onChange} required autoComplete="current-password" />
            </div>
            <button type="submit" className="btn-primary w-full py-3 mt-1" disabled={loading}>
              {loading
                ? <span className="flex items-center gap-2"><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Signing in…</span>
                : "Sign In →"
              }
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-ink-4 mt-6">
          No account?{" "}
          <Link to="/register" className="text-accent hover:text-accent/80 font-medium transition-colors">Create one free</Link>
        </p>
      </div>
    </div>
  );
}
