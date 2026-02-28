import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const handleLogout = () => { logout(); navigate("/"); setMenuOpen(false); };

  const linkCls = ({ isActive }) =>
    `text-sm px-3 py-1.5 rounded-lg transition-all duration-150 ${
      isActive ? "text-accent bg-accent/10 font-medium" : "text-ink-3 hover:text-white hover:bg-surface-3"
    }`;

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "bg-surface-1/80 backdrop-blur-xl border-b border-brd" : "bg-transparent"}`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/30 flex items-center justify-center text-accent font-bold font-display text-sm group-hover:bg-accent/20 transition-all">
            L
          </div>
          <span className="font-display font-bold text-lg text-white tracking-tight">ListHub</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden sm:flex items-center gap-1">
          <NavLink to="/listings" className={linkCls}>Browse</NavLink>
          {user ? (
            <>
              <NavLink to="/create" className={linkCls}>+ Create</NavLink>
              <div className="flex items-center gap-3 ml-3 pl-3 border-l border-brd">
                <div className="w-7 h-7 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center text-accent text-xs font-bold font-display">
                  {user.username[0].toUpperCase()}
                </div>
                <span className="text-sm text-ink-2">{user.username}</span>
                <button onClick={handleLogout} className="text-xs text-ink-3 hover:text-red-400 px-3 py-1.5 rounded-lg hover:bg-surface-3 transition-all">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2 ml-2">
              <NavLink to="/login" className={linkCls}>Login</NavLink>
              <Link to="/register" className="btn-primary text-xs px-4 py-2">Get Started</Link>
            </div>
          )}
        </div>

        {/* Mobile burger */}
        <button className="sm:hidden p-2 rounded-lg text-ink-3 hover:bg-surface-3 transition-all" onClick={() => setMenuOpen(o => !o)}>
          {menuOpen
            ? <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12"/></svg>
            : <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16"/></svg>
          }
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="sm:hidden border-t border-brd px-4 pb-4 pt-3 space-y-1 animate-fade-in bg-surface-1">
          <NavLink to="/listings" className={linkCls} onClick={() => setMenuOpen(false)}>Browse</NavLink>
          {user ? (
            <>
              <NavLink to="/create" className={linkCls} onClick={() => setMenuOpen(false)}>+ Create</NavLink>
              <p className="px-3 py-1.5 text-sm text-ink-3">Signed in as <span className="text-white font-medium">{user.username}</span></p>
              <button onClick={handleLogout} className="w-full text-left px-3 py-1.5 text-sm text-ink-3 hover:text-red-400 rounded-lg hover:bg-surface-3 transition-all">Logout</button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={linkCls} onClick={() => setMenuOpen(false)}>Login</NavLink>
              <Link to="/register" className="btn-primary w-full mt-1" onClick={() => setMenuOpen(false)}>Get Started</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
