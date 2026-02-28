import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

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

export default function ListingCard({ listing, onVote, votingId }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const uid      = user?.id || user?._id;
  const hasVoted = !!uid && listing.votes?.some(v => v === uid || v?._id === uid);
  const isVoting = votingId === listing._id;
  const count    = listing.voteCount ?? listing.votes?.length ?? 0;
  const catCls   = CAT_STYLES[listing.category] || CAT_STYLES.Other;

  return (
    <div className="card card-hover group flex gap-4 p-5">
      {/* Vote */}
      <div className="flex flex-col items-center gap-1 pt-0.5 min-w-[40px]">
        <button
          onClick={() => user ? onVote(listing._id) : navigate("/login")}
          disabled={isVoting}
          className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center border transition-all duration-200
            ${hasVoted
              ? "bg-accent border-accent/50 text-white shadow-lg shadow-accent/25 scale-105"
              : "bg-surface-3 border-brd text-ink-3 hover:border-accent/40 hover:text-accent hover:bg-accent/10 hover:scale-105"
            } ${isVoting ? "opacity-50 cursor-wait" : "cursor-pointer active:scale-95"}`}
        >
          <svg className="w-3.5 h-3.5" fill={hasVoted ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
        <span className={`text-xs font-mono font-bold ${hasVoted ? "text-accent" : "text-ink-3"}`}>{count}</span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1.5">
          <h3 className="font-display font-semibold text-white text-base group-hover:text-accent transition-colors">
            {listing.title}
          </h3>
          <span className={`badge border ${catCls}`}>{listing.category}</span>
        </div>

        <p className="text-sm text-ink-3 line-clamp-2 leading-relaxed mb-3">{listing.description}</p>

        <div className="flex flex-wrap items-center gap-4 text-xs text-ink-4">
          <span className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-full bg-surface-4 border border-brd inline-flex items-center justify-center text-[9px] text-accent font-bold font-display">
              {listing.creator?.username?.[0]?.toUpperCase() || "?"}
            </span>
            <span className="text-ink-3">{listing.creator?.username || "Unknown"}</span>
          </span>
          {listing.discordInfo && (
            <span className="text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full font-mono">
              {listing.discordInfo}
            </span>
          )}
          <span className="font-mono">{new Date(listing.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
        </div>
      </div>
    </div>
  );
}
