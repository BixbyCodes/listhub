import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Comments from "../components/Comments";

const CAT_STYLES = {
  Gaming:       "border-purple-500/30 text-purple-400 bg-purple-500/10",
  Technology:   "border-cyan-500/30   text-cyan-400   bg-cyan-500/10",
  "Art & Design":"border-pink-500/30  text-pink-400   bg-pink-500/10",
  Music:        "border-yellow-500/30 text-yellow-400 bg-yellow-500/10",
  Education:    "border-green-500/30  text-green-400  bg-green-500/10",
  Business:     "border-orange-500/30 text-orange-400 bg-orange-500/10",
  General:      "border-brd text-ink-3 bg-surface-3",
  Other:        "border-brd text-ink-4 bg-surface-3",
};

export default function ListingDetail() {
  const { id }        = useParams();
  const { user }      = useAuth();
  const navigate      = useNavigate();
  const [listing, setListing]   = useState(null);
  const [loading, setLoading]   = useState(true);
  const [voting, setVoting]     = useState(false);
  const [error, setError]       = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get(`/listings/${id}`);
        setListing(data.listing);
      } catch {
        setError("Listing not found.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const handleVote = async () => {
    if (!user) { navigate("/login"); return; }
    setVoting(true);
    try {
      const { data } = await api.post(`/listings/${id}/vote`);
      setListing(prev => {
        const uid = user.id || user._id;
        const newVotes = data.voted
          ? [...(prev.votes || []), uid]
          : (prev.votes || []).filter(v => v !== uid);
        return { ...prev, votes: newVotes, voteCount: data.voteCount };
      });
    } catch (err) { alert(err.message); }
    finally { setVoting(false); }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (error) return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <p className="text-ink-3 mb-4">{error}</p>
      <Link to="/listings" className="btn-ghost px-6">← Back to Listings</Link>
    </div>
  );

  const uid      = user?.id || user?._id;
  const hasVoted = !!uid && listing.votes?.some(v => v === uid || v?._id === uid);
  const count    = listing.voteCount ?? listing.votes?.length ?? 0;
  const catCls   = CAT_STYLES[listing.category] || CAT_STYLES.Other;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 animate-fade-up">
      {/* Back link */}
      <Link to="/listings" className="inline-flex items-center gap-1.5 text-sm text-ink-3 hover:text-white transition-colors mb-8 group">
        <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
        </svg>
        Back to Listings
      </Link>

      <div className="card p-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className={`badge border ${catCls}`}>{listing.category}</span>
              {listing.discordInfo && (
                <span className="text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full font-mono text-xs">
                  {listing.discordInfo}
                </span>
              )}
            </div>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-white leading-tight">
              {listing.title}
            </h1>
          </div>

          {/* Vote button */}
          <div className="flex flex-col items-center gap-1 shrink-0">
            <button
              onClick={handleVote}
              disabled={voting}
              className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center border transition-all duration-200
                ${hasVoted
                  ? "bg-accent border-accent/50 text-white shadow-lg shadow-accent/25 scale-105"
                  : "bg-surface-3 border-brd text-ink-3 hover:border-accent/40 hover:text-accent hover:bg-accent/10 hover:scale-105"
                } ${voting ? "opacity-50 cursor-wait" : "cursor-pointer active:scale-95"}`}
            >
              <svg className="w-5 h-5" fill={hasVoted ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7"/>
              </svg>
            </button>
            <span className={`text-sm font-mono font-bold ${hasVoted ? "text-accent" : "text-ink-3"}`}>{count}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-ink-2 leading-relaxed text-base mb-6">{listing.description}</p>

        {/* Meta */}
        <div className="flex items-center gap-4 text-xs text-ink-4 pt-4 border-t border-brd">
          <span className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center text-accent text-[10px] font-bold">
              {listing.creator?.username?.[0]?.toUpperCase()}
            </div>
            <span className="text-ink-3">{listing.creator?.username}</span>
          </span>
          <span className="font-mono">
            {new Date(listing.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </span>
        </div>

        {/* Comments */}
        <Comments listingId={id} />
      </div>
    </div>
  );
}
