import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import ListingCard from "../components/ListingCard";

const CATS = ["All","General","Gaming","Technology","Art & Design","Music","Education","Business","Other"];

export default function Listings() {
  const { user } = useAuth();
  const [listings, setListings]     = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");
  const [search, setSearch]         = useState("");
  const [category, setCategory]     = useState("All");
  const [sort, setSort]             = useState("votes");
  const [page, setPage]             = useState(1);
  const [votingId, setVotingId]     = useState(null);
  const [debSearch, setDebSearch]   = useState("");

  useEffect(() => { const t = setTimeout(() => setDebSearch(search), 400); return () => clearTimeout(t); }, [search]);
  useEffect(() => { setPage(1); }, [debSearch, category, sort]);

  const fetchListings = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const params = new URLSearchParams({ page, sort, ...(category !== "All" && { category }), ...(debSearch && { search: debSearch }) });
      const { data } = await api.get(`/listings?${params}`);
      setListings(data.listings);
      setPagination(data.pagination);
    } catch { setError("Failed to load listings."); }
    finally { setLoading(false); }
  }, [page, sort, category, debSearch]);

  useEffect(() => { fetchListings(); }, [fetchListings]);

  const handleVote = async (id) => {
    if (!user) return;
    setVotingId(id);
    try {
      const { data } = await api.post(`/listings/${id}/vote`);
      setListings(prev => prev.map(l => {
        if (l._id !== id) return l;
        const uid = user.id || user._id;
        const newVotes = data.voted
          ? [...(l.votes||[]), uid]
          : (l.votes||[]).filter(v => v !== uid && v?._id !== uid);
        return { ...l, votes: newVotes, voteCount: data.voteCount };
      }));
    } catch (err) { alert(err.message); }
    finally { setVotingId(null); }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono text-ink-4 border border-brd px-3 py-1.5 rounded-full mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block animate-pulse-slow" />
            {pagination.total} listing{pagination.total !== 1 ? "s" : ""}
          </div>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-white">Browse Listings</h1>
        </div>
        {user && <Link to="/create" className="btn-primary whitespace-nowrap">+ Create Listing</Link>}
      </div>

      {/* Search + sort */}
      <div className="card p-4 mb-5 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          <input type="text" className="input pl-10" placeholder="Search listings…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="input sm:w-40" value={sort} onChange={e => setSort(e.target.value)} style={{ colorScheme: "dark" }}>
          <option value="votes">Top Voted</option>
          <option value="newest">Newest</option>
        </select>
      </div>

      {/* Category pills */}
      <div className="flex gap-2 flex-wrap mb-6">
        {CATS.map(c => (
          <button key={c} onClick={() => setCategory(c)}
            className={`text-xs font-mono px-3 py-1.5 rounded-full border transition-all duration-150
              ${category === c ? "bg-accent/15 border-accent/40 text-accent" : "border-brd text-ink-4 hover:border-brd-bright hover:text-ink-2"}`}>
            {c}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card p-5 h-28" style={{ animation: `fadeIn 0.3s ${i*0.08}s ease both` }}>
              <div className="flex gap-4 h-full animate-pulse">
                <div className="w-10 h-10 rounded-xl bg-surface-3 shrink-0" />
                <div className="flex-1 space-y-2 pt-1">
                  <div className="h-4 bg-surface-3 rounded w-2/3" />
                  <div className="h-3 bg-surface-3 rounded w-full" />
                  <div className="h-3 bg-surface-3 rounded w-4/5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-20">
          <p className="text-red-400 mb-4">{error}</p>
          <button onClick={fetchListings} className="btn-ghost">Retry</button>
        </div>
      ) : listings.length === 0 ? (
        <div className="text-center py-24">
          <div className="text-5xl mb-4 opacity-20 font-display">◈</div>
          <p className="font-display font-semibold text-ink-2 text-lg mb-1">No listings found</p>
          <p className="text-sm text-ink-4">
            {user ? <><Link to="/create" className="text-accent underline">Create the first one</Link></> : "Try different filters."}
          </p>
        </div>
      ) : (
        <div className="space-y-3 stagger">
          {listings.map(l => <ListingCard key={l._id} listing={l} onVote={handleVote} votingId={votingId} />)}
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-10">
          <button onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1} className="btn-ghost px-4 py-2 disabled:opacity-30">← Prev</button>
          <div className="flex gap-1">
            {Array.from({ length: pagination.pages }, (_, i) => i+1).filter(p => Math.abs(p-page) <= 2).map(p => (
              <button key={p} onClick={() => setPage(p)}
                className={`w-9 h-9 rounded-xl text-sm font-mono transition-all ${p===page ? "bg-accent text-white shadow-lg shadow-accent/25" : "bg-surface-3 border border-brd text-ink-3 hover:border-brd-bright"}`}>
                {p}
              </button>
            ))}
          </div>
          <button onClick={() => setPage(p => Math.min(pagination.pages,p+1))} disabled={page===pagination.pages} className="btn-ghost px-4 py-2 disabled:opacity-30">Next →</button>
        </div>
      )}

      {/* Guest prompt */}
      {!user && listings.length > 0 && (
        <div className="mt-10 card p-6 text-center" style={{ borderColor: "rgba(129,140,248,0.2)" }}>
          <p className="text-white font-display font-semibold mb-1">Want to vote or create?</p>
          <p className="text-ink-4 text-sm mb-4">It's free and takes 30 seconds.</p>
          <div className="flex gap-2 justify-center">
            <Link to="/register" className="btn-primary px-6">Sign Up Free</Link>
            <Link to="/login" className="btn-ghost px-6">Log In</Link>
          </div>
        </div>
      )}
    </div>
  );
}
