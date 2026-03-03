import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Comments({ listingId }) {
  const { user }                    = useAuth();
  const [comments, setComments]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [text, setText]             = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]           = useState("");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchComments();
  }, [listingId]);

  const fetchComments = async () => {
    try {
      const { data } = await api.get(`/listings/${listingId}/comments`);
      setComments(data.comments);
    } catch { /* silent fail */ }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setSubmitting(true);
    setError("");
    try {
      const { data } = await api.post(`/listings/${listingId}/comments`, { text });
      setComments(prev => [data.comment, ...prev]);
      setText("");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    setDeletingId(commentId);
    try {
      await api.delete(`/comments/${commentId}`);
      setComments(prev => prev.filter(c => c._id !== commentId));
    } catch (err) {
      alert(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const Avatar = ({ u, size = "w-7 h-7" }) => (
    u?.avatar
      ? <img src={u.avatar} alt={u.username} className={`${size} rounded-full object-cover border border-brd`} />
      : <div className={`${size} rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center text-accent text-xs font-bold font-display`}>
          {u?.username?.[0]?.toUpperCase() || "?"}
        </div>
  );

  return (
    <div className="mt-6 pt-6 border-t border-brd">
      {/* Header */}
      <h3 className="font-display font-semibold text-white mb-4 flex items-center gap-2">
        <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
        </svg>
        Comments
        <span className="text-xs font-mono text-ink-4 bg-surface-3 border border-brd px-2 py-0.5 rounded-full">
          {comments.length}
        </span>
      </h3>

      {/* Comment form */}
      {user ? (
        <form onSubmit={handleSubmit} className="mb-5">
          <div className="flex gap-3">
            <Avatar u={user} />
            <div className="flex-1">
              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Add a comment…"
                rows={2}
                maxLength={500}
                className="input resize-none text-sm"
              />
              {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs font-mono text-ink-4">{text.length}/500</span>
                <button
                  type="submit"
                  disabled={submitting || !text.trim()}
                  className="btn-primary px-4 py-1.5 text-xs disabled:opacity-40"
                >
                  {submitting ? "Posting…" : "Post Comment"}
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-5 p-4 rounded-xl bg-surface-2 border border-brd text-center">
          <p className="text-sm text-ink-3">
            <Link to="/login" className="text-accent font-medium hover:underline">Sign in</Link>
            {" "}to leave a comment
          </p>
        </div>
      )}

      {/* Comments list */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex gap-3 animate-pulse">
              <div className="w-7 h-7 rounded-full bg-surface-3 shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 bg-surface-3 rounded w-1/4" />
                <div className="h-3 bg-surface-3 rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <p className="text-sm text-ink-4 text-center py-4 font-mono">No comments yet — be the first!</p>
      ) : (
        <div className="space-y-4">
          {comments.map(c => (
            <div key={c._id} className="flex gap-3 group animate-fade-in">
              <Avatar u={c.creator} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white">{c.creator?.username}</span>
                    <span className="text-xs font-mono text-ink-4">
                      {new Date(c.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                  </div>
                  {/* Delete button — only for comment owner */}
                  {user && (user.id === c.creator?._id || user._id === c.creator?._id) && (
                    <button
                      onClick={() => handleDelete(c._id)}
                      disabled={deletingId === c._id}
                      className="opacity-0 group-hover:opacity-100 text-ink-4 hover:text-red-400 transition-all text-xs"
                    >
                      {deletingId === c._id ? "…" : "Delete"}
                    </button>
                  )}
                </div>
                <p className="text-sm text-ink-2 mt-0.5 leading-relaxed">{c.text}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
