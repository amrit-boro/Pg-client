import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const PRIMARY = "#1f1fe0";

// ─── Search Overlay ───────────────────────────────────────────────
export function SearchOverlay({ open, onClose, onSelect, navigate }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);
  //   const navigate = useNavigate();

  // focus on open
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery("");
      setResults([]);
      setActiveIdx(-1);
    }
  }, [open]);

  // Esc to close
  useEffect(() => {
    const fn = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, [onClose]);

  // keyboard nav
  useEffect(() => {
    const fn = (e) => {
      if (!open || !results.length) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIdx((i) => Math.min(i + 1, results.length - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIdx((i) => Math.max(i - 1, 0));
      }
      if (e.key === "Enter" && activeIdx >= 0)
        handleSelect(e, results[activeIdx]);
    };
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, [open, results, activeIdx]);

  // debounced API call
  const search = useCallback((q) => {
    clearTimeout(debounceRef.current);
    console.log("search() called with:", q); // fires on every keystroke

    if (!q.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      console.log("fetching API for:", q); // fires only after 300ms pause

      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/v1/listings/search?q=${encodeURIComponent(q)}`,
        );
        console.log("URL:", res);

        const json = await res.json();
        console.log("result set: ", json);
        setResults(json.success ? json.data : []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);
  }, []);

  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    setActiveIdx(-1);
    search(val);
  };

  const handleSelect = (e, item) => {
    e.preventDefault();
    console.log("from navigate");
    // onSelect(item); // bubble up to parent
    onClose();
    navigate(`/listingDetail?pgId=${item.id}&type=single`);
    console.log("hel");
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] flex flex-col items-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/35" onClick={onClose} />

      {/* Panel */}
      <div
        className="relative mt-14 w-full max-w-[620px] px-4 z-10"
        style={{
          animation: "searchIn 0.25s cubic-bezier(0.34,1.56,0.64,1) forwards",
        }}
      >
        <style>{`
          @keyframes searchIn {
            from { transform: translateY(-12px) scale(0.98); opacity: 0; }
            to   { transform: translateY(0) scale(1); opacity: 1; }
          }
        `}</style>

        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xl">
          {/* Input row */}
          <div className="flex items-center gap-2 px-3.5 py-2.5 border-b border-slate-100">
            <span
              className="material-symbols-outlined text-xl"
              style={{ color: PRIMARY }}
            >
              search
            </span>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={handleChange}
              placeholder="Search PGs, locations, amenities…"
              className="flex-1 text-[14px] outline-none bg-transparent text-slate-800 placeholder-slate-400"
            />
            {loading && (
              <svg
                className="animate-spin w-4 h-4 text-slate-400 flex-shrink-0"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="3"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                />
              </svg>
            )}
            {!loading && (
              <span className="text-[10px] text-slate-400 bg-slate-100 border border-slate-200 rounded px-1.5 py-0.5">
                Esc
              </span>
            )}
            <button
              onClick={onClose}
              className="p-0.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">
                close
              </span>
            </button>
          </div>

          {/* Results */}
          <div className="max-h-[360px] overflow-y-auto">
            {!query.trim() && (
              <p className="text-[13px] text-slate-400 text-center py-6">
                Start typing to search PGs…
              </p>
            )}

            {query.trim() && !loading && results.length === 0 && (
              <p className="text-[13px] text-slate-400 text-center py-6">
                No results for "{query}"
              </p>
            )}

            {results.length > 0 && (
              <>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-3.5 pt-2.5 pb-1">
                  {results.length} result{results.length !== 1 ? "s" : ""}
                </p>
                {results.map((item, i) => (
                  <button
                    key={item.id}
                    onClick={(e) => handleSelect(e, item)}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-left transition-colors ${
                      i === activeIdx ? "bg-slate-50" : "hover:bg-slate-50"
                    }`}
                  >
                    {/* Thumbnail */}
                    <img
                      src={item.photo_url || "https://via.placeholder.com/48"}
                      alt={item.title}
                      className="w-10 h-10 rounded-lg object-cover flex-shrink-0 border border-slate-100"
                    />
                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium text-slate-800 truncate">
                        {item.title}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">
                        {item.description}
                      </p>
                    </div>
                    {/* Price + rating */}
                    <div className="flex-shrink-0 text-right">
                      <p
                        className="text-[12px] font-bold"
                        style={{ color: PRIMARY }}
                      >
                        ₹{Number(item.starting_price).toLocaleString()}
                        <span className="text-[10px] font-normal text-slate-400">
                          /mo
                        </span>
                      </p>
                      <p className="text-[11px] text-amber-500 font-medium">
                        ★ {Number(item.avg_rating).toFixed(1)}
                      </p>
                    </div>
                  </button>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
