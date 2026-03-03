import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

const CATEGORIES = ["General","Gaming","Technology","Art & Design","Music","Education","Business","Other"];

export default function CreateListing() {
  const navigate = useNavigate();
  const [form, setForm]               = useState({ title: "", description: "", category: "", discordInfo: "" });
  const [agreed, setAgreed]           = useState(false);
  const [errors, setErrors]           = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading]         = useState(false);
  const [showTerms, setShowTerms]     = useState(false);

  const onChange = e => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
    setErrors(p => ({ ...p, [e.target.name]: "" }));
  };

  const validate = () => {
    const e = {};
    if (form.title.trim().length < 3)       e.title = "Min 3 characters";
    if (form.title.trim().length > 100)     e.title = "Max 100 characters";
    if (form.description.trim().length < 10) e.description = "Min 10 characters";
    if (!form.category)                     e.category = "Please select a category";
    if (!agreed)                            e.terms = "You must agree to the Terms & Conditions";
    return e;
  };

  const onSubmit = async e => {
    e.preventDefault();
    setServerError("");
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await api.post("/listings", form);
      navigate("/listings");
    } catch (err) {
      setServerError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 animate-fade-up">
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 text-xs font-mono text-ink-4 border border-brd px-3 py-1.5 rounded-full mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" />
          New Listing
        </div>
        <h1 className="font-display font-bold text-3xl sm:text-4xl text-white mb-2">Share something great</h1>
        <p className="text-ink-3 text-sm">Post a listing and let the community discover it.</p>
      </div>

      <div className="card p-8">
        <form onSubmit={onSubmit} className="space-y-6">
          {serverError && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl">
              {serverError}
            </div>
          )}

          {/* Title */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="label mb-0">Title <span className="text-accent normal-case">*</span></label>
              <span className="text-xs font-mono text-ink-4">{form.title.length}/100</span>
            </div>
            <input name="title" type="text" className={`input ${errors.title ? "border-red-500/50" : ""}`} placeholder="Give your listing a compelling title" value={form.title} onChange={onChange} maxLength={100} />
            {errors.title && <p className="text-xs text-red-400 mt-1.5">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="label mb-0">Description <span className="text-accent normal-case">*</span></label>
              <span className="text-xs font-mono text-ink-4">{form.description.length}/2000</span>
            </div>
            <textarea name="description" rows={5} className={`input resize-none ${errors.description ? "border-red-500/50" : ""}`} placeholder="Describe what makes this listing unique…" value={form.description} onChange={onChange} maxLength={2000} />
            {errors.description && <p className="text-xs text-red-400 mt-1.5">{errors.description}</p>}
          </div>

          {/* Category */}
          <div>
            <label className="label">Category <span className="text-accent normal-case">*</span></label>
            <select name="category" className={`input ${errors.category ? "border-red-500/50" : ""}`} value={form.category} onChange={onChange} style={{ colorScheme: "dark" }}>
              <option value="" disabled>Select a category…</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            {errors.category && <p className="text-xs text-red-400 mt-1.5">{errors.category}</p>}
          </div>

          {/* Discord */}
          <div>
            <label className="label">Discord <span className="text-ink-4 normal-case font-normal tracking-normal">(optional)</span></label>
            <input name="discordInfo" type="text" className="input" placeholder="username#1234 or discord.gg/invite" value={form.discordInfo} onChange={onChange} maxLength={100} />
          </div>

          {/* Terms & Conditions */}
          <div className={`rounded-xl border p-4 transition-all duration-200 ${errors.terms ? "border-red-500/30 bg-red-500/5" : "border-brd bg-surface-2"}`}>
            <div className="flex items-start gap-3">
              {/* Custom checkbox */}
              <button
                type="button"
                onClick={() => { setAgreed(p => !p); setErrors(p => ({ ...p, terms: "" })); }}
                className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all duration-200
                  ${agreed
                    ? "bg-accent border-accent"
                    : "bg-surface-3 border-brd-bright hover:border-accent/50"
                  }`}
              >
                {agreed && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>

              <div className="flex-1">
                <p className="text-sm text-ink-2">
                  I agree to the{" "}
                  <button
                    type="button"
                    onClick={() => setShowTerms(true)}
                    className="text-accent hover:text-accent/80 underline underline-offset-2 transition-colors font-medium"
                  >
                    Terms & Conditions
                  </button>
                </p>
                <p className="text-xs text-ink-4 mt-0.5">
                  Your listing must follow community guidelines and not contain harmful content.
                </p>
              </div>
            </div>
            {errors.terms && (
              <p className="text-xs text-red-400 mt-2 flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                </svg>
                {errors.terms}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2 border-t border-brd">
            <button type="button" onClick={() => navigate("/listings")} className="btn-ghost px-6">Cancel</button>
            <button type="submit" className="btn-primary flex-1 py-3" disabled={loading}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Publishing…
                </span>
              ) : "Publish Listing →"}
            </button>
          </div>
        </form>
      </div>

      {/* Terms Modal */}
      {showTerms && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowTerms(false)}
          />

          {/* Modal */}
          <div className="relative card p-6 max-w-md w-full max-h-[80vh] overflow-y-auto animate-fade-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-bold text-xl text-white">Terms & Conditions</h2>
              <button
                onClick={() => setShowTerms(false)}
                className="text-ink-3 hover:text-white transition-colors p-1 rounded-lg hover:bg-surface-3"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4 text-sm text-ink-3 leading-relaxed">
              <div>
                <h3 className="text-white font-medium font-display mb-1">1. Content Guidelines</h3>
                <p>All listings must be accurate, honest and relevant. Do not post misleading, harmful or offensive content.</p>
              </div>
              <div>
                <h3 className="text-white font-medium font-display mb-1">2. No Spam</h3>
                <p>Do not create duplicate listings or use the platform to promote spam, scams or illegal activities.</p>
              </div>
              <div>
                <h3 className="text-white font-medium font-display mb-1">3. Respectful Community</h3>
                <p>Treat other community members with respect. Hateful, discriminatory or abusive content will be removed.</p>
              </div>
              <div>
                <h3 className="text-white font-medium font-display mb-1">4. Ownership</h3>
                <p>By posting a listing you confirm that you have the right to share the content and it does not infringe any copyright.</p>
              </div>
              <div>
                <h3 className="text-white font-medium font-display mb-1">5. Removal</h3>
                <p>ListHub reserves the right to remove any listing that violates these terms without prior notice.</p>
              </div>
            </div>

            <button
              onClick={() => { setAgreed(true); setShowTerms(false); setErrors(p => ({ ...p, terms: "" })); }}
              className="btn-primary w-full mt-6 py-3"
            >
              I Agree & Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
