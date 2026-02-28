import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

// Field must live OUTSIDE Register — if defined inside, React remounts
// the input on every keystroke (new component type each render = focus lost)
function Field({ name, label, type = "text", placeholder, value, onChange, error }) {
  return (
    <div>
      <label className="label">{label}</label>
      <input
        type={type}
        name={name}
        className={`input ${error ? "border-red-500/50 focus:border-red-500" : ""}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
      />
      {error && <p className="text-xs text-red-400 mt-1.5">{error}</p>}
    </div>
  );
}

export default function Register() {
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const [form, setForm]               = useState({ username: "", email: "", password: "", confirm: "" });
  const [errors, setErrors]           = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading]         = useState(false);

  const onChange = e => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
    setErrors(p => ({ ...p, [e.target.name]: "" }));
  };

  const validate = () => {
    const e = {};
    if (form.username.trim().length < 3) e.username = "Min 3 characters";
    if (!/^[a-zA-Z0-9_]+$/.test(form.username)) e.username = "Letters, numbers & underscores only";
    if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email";
    if (form.password.length < 6) e.password = "Min 6 characters";
    if (form.password !== form.confirm) e.confirm = "Passwords don't match";
    return e;
  };

  const onSubmit = async e => {
    e.preventDefault();
    setServerError("");
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const { data } = await api.post("/auth/register", {
        username: form.username,
        email: form.email,
        password: form.password,
      });
      loginUser(data.user, data.token);
      navigate("/listings");
    } catch (err) {
      setServerError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-16 relative">
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(129,140,248,0.05), transparent)" }} />

      <div className="w-full max-w-sm animate-fade-up relative">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent font-display font-bold text-xl mx-auto mb-4">L</div>
          <h1 className="font-display font-bold text-2xl text-white">Create an account</h1>
          <p className="text-ink-3 text-sm mt-1">Join the ListHub community — free forever</p>
        </div>

        <div className="card p-6">
          <form onSubmit={onSubmit} className="space-y-4">
            {serverError && (
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl">
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                {serverError}
              </div>
            )}

            <Field name="username" label="Username"         placeholder="cooluser_42"       value={form.username} onChange={onChange} error={errors.username} />
            <Field name="email"    label="Email"    type="email"    placeholder="you@example.com"  value={form.email}    onChange={onChange} error={errors.email} />
            <Field name="password" label="Password" type="password" placeholder="Min 6 characters" value={form.password} onChange={onChange} error={errors.password} />
            <Field name="confirm"  label="Confirm Password" type="password" placeholder="Repeat password" value={form.confirm}  onChange={onChange} error={errors.confirm} />

            <button type="submit" className="btn-primary w-full py-3 mt-1" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Creating…
                </span>
              ) : "Create Account →"}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-ink-4 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-accent hover:text-accent/80 font-medium transition-colors">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
