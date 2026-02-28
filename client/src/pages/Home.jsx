import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const FEATURES = [
  { icon: "⬆", title: "Community Voting",  desc: "Upvote what you love. The best content rises naturally." },
  { icon: "◈", title: "Create Listings",   desc: "Share your project, server, or idea in seconds." },
  { icon: "⌖", title: "Search & Filter",   desc: "Find exactly what you need with instant filtering." },
  { icon: "⬡", title: "Discord Links",     desc: "Connect your Discord community to any listing." },
];

export default function Home() {
  const { user } = useAuth();

  return (
    <div>
      {/* ── Hero ── */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        {/* glow blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full" style={{ background: "radial-gradient(ellipse, rgba(129,140,248,0.07) 0%, transparent 70%)" }} />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] rounded-full" style={{ background: "radial-gradient(ellipse, rgba(79,70,229,0.06) 0%, transparent 70%)" }} />
          {/* dot grid */}
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(#818cf8 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center py-24">
          {/* pill badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-mono mb-8 animate-fade-in">
            <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block animate-pulse-slow" />
            Open platform · Community-first
          </div>

          <h1 className="font-display font-extrabold text-5xl sm:text-7xl leading-[1.05] tracking-tight mb-6" style={{ animation: "fadeUp 0.6s 0.1s ease both" }}>
            <span style={{ background: "linear-gradient(135deg,#fff 30%,#a1a1aa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Discover &amp; share
            </span>
            <br />
            <span style={{ background: "linear-gradient(135deg,#818cf8,#c4b5fd)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              community listings
            </span>
          </h1>

          <p className="text-ink-3 text-lg max-w-lg mx-auto mb-10 leading-relaxed" style={{ animation: "fadeUp 0.6s 0.2s ease both" }}>
            An open platform where listings rise by merit. Browse freely — sign up to create and vote.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center" style={{ animation: "fadeUp 0.6s 0.3s ease both" }}>
            <Link to="/listings" className="btn-primary px-8 py-3 text-base">
              Browse Listings
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
            </Link>
            {user
              ? <Link to="/create" className="btn-ghost px-8 py-3 text-base">+ Create a Listing</Link>
              : <Link to="/register" className="btn-ghost px-8 py-3 text-base">Create Account — Free</Link>
            }
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-24 px-4 border-t border-brd">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-white mb-3">Built for communities</h2>
            <p className="text-ink-3 max-w-sm mx-auto text-sm">Everything you need to surface great content. Nothing you don't.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map((f, i) => (
              <div key={f.title} className="card card-hover p-6 group" style={{ animation: `fadeUp 0.5s ${0.1 + i * 0.07}s ease both` }}>
                <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent text-lg mb-4 group-hover:bg-accent/20 transition-all">
                  {f.icon}
                </div>
                <h3 className="font-display font-semibold text-white mb-2 text-sm">{f.title}</h3>
                <p className="text-xs text-ink-3 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      {!user && (
        <section className="py-24 px-4 border-t border-brd relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 50% at 50% 100%, rgba(129,140,248,0.06), transparent)" }} />
          <div className="relative max-w-xl mx-auto text-center">
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-white mb-4">Ready to share?</h2>
            <p className="text-ink-3 mb-8 text-sm">Join in seconds — no credit card, no nonsense.</p>
            <Link to="/register" className="btn-primary px-10 py-3 text-base">Get Started Free</Link>
          </div>
        </section>
      )}
    </div>
  );
}
