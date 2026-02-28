import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const CATEGORIES = ["General","Gaming","Technology","Art & Design","Music","Education","Business","Other"];

export default function CreateListing() {
  const navigate = useNavigate();
  const [form, setForm]               = useState({ title: "", description: "", category: "", discordInfo: "" });
  const [errors, setErrors]           = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading]         = useState(false);

  const onChange = e => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
    setErrors(p => ({ ...p, [e.target.name]: "" }));
  };

  const validate = () => {
    const e = {};
    if (form.title.trim().length < 3)    e.title = "Min 3 characters";
    if (form.title.trim().length > 100)  e.title = "Max 100 characters";
    if (form.description.trim().length < 10)  e.description = "Min 10 characters";
    if (!form.category)                  e.category = "Please select a category";
    return e;
  };

  const onSubmit = async e => {
    e.preventDefault(); setServerError("");
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await api.post("/listings", form);
      navigate("/listings");
    } catch (err) { setServerError(err.message); }
    finally { setLoading(false); }
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

          <div className="flex gap-3 pt-2 border-t border-brd">
            <button type="button" onClick={() => navigate("/listings")} className="btn-ghost px-6">Cancel</button>
            <button type="submit" className="btn-primary flex-1 py-3" disabled={loading}>
              {loading
                ? <span className="flex items-center justify-center gap-2"><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Publishing…</span>
                : "Publish Listing →"
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
