import { useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { useFilteredPg } from "../../../hooks/usePgdetail";
import { SearchOverlay } from "./SearchOverlay";
import { useSaveListing } from "../../../hooks/useSaveListing";
import Header from "../Home/Header";
import AllHeader from "../../Header/Header";

function StarIcon({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

function HeartIcon({ filled = false, className = "" }) {
  return filled ? (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  ) : (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
      />
    </svg>
  );
}

function MapIcon({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
    >
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
      <line x1="8" y1="2" x2="8" y2="18" />
      <line x1="16" y1="6" x2="16" y2="22" />
    </svg>
  );
}

function FilterIcon({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
    >
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="8" y1="12" x2="16" y2="12" />
      <line x1="11" y1="18" x2="13" y2="18" />
    </svg>
  );
}

function EmptyState() {
  return (
    <div className="col-span-full flex flex-col items-center justify-center min-h-[420px] py-10 px-4 text-center">
      {/* Animated House Illustration */}
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center animate-pulse">
          <svg
            className="w-12 h-12 text-blue-200"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
          </svg>
        </div>
        {/* Floating dots */}
        <span
          className="absolute top-0 right-0 w-3 h-3 bg-blue-300 rounded-full animate-bounce"
          style={{ animationDelay: "0s" }}
        />
        <span
          className="absolute bottom-1 left-0 w-2 h-2 bg-indigo-300 rounded-full animate-bounce"
          style={{ animationDelay: "0.2s" }}
        />
        <span
          className="absolute top-4 -left-3 w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"
          style={{ animationDelay: "0.4s" }}
        />
      </div>

      <h2 className="text-lg font-black text-slate-700 mb-1 tracking-tight">
        No Rooms Found
      </h2>
      <p className="text-xs text-slate-400 max-w-xs leading-relaxed mb-5">
        Looks like there are no PGs matching your current filters. Try adjusting
        the price range or clearing filters.
      </p>

      <div className="flex items-center gap-2">
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-700 text-white text-xs font-bold rounded-full hover:bg-blue-800 transition-all shadow-md shadow-blue-700/20 hover:scale-105"
        >
          Reset Filters
        </button>

        <a
          href="#"
          className="px-4 py-2 border border-slate-200 text-slate-500 text-xs font-bold rounded-full hover:bg-slate-100 transition-all"
        >
          Browse All
        </a>
      </div>
    </div>
  );
}
function PGCard({ listing }) {
  const [favorited, setFavorited] = useState(false);
  const [saved, setSaved] = useState(listing.isSaved ?? false); // ← init from server
  const { save, remove, isPending } = useSaveListing();

  const handleSave = (e) => {
    e.preventDefault();
    if (saved) {
      remove(listing.id, { onSuccess: () => setSaved(false) });
    } else {
      save(listing.id, { onSuccess: () => setSaved(true) });
    }
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 group flex flex-col h-full">
      {/* Image */}
      <div className="relative h-40 sm:h-44 overflow-hidden">
        <img
          src={listing.img}
          alt={listing.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded-md flex items-center gap-0.5 shadow-sm">
          <StarIcon className="w-3 h-3 text-yellow-500" />
          <span className="text-[10px] font-bold">{listing.rating}</span>
        </div>
        {listing.badge && (
          <div
            className={`absolute top-2.5 left-2.5 ${listing.badge.color} text-white px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider`}
          >
            {listing.badge.label}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3.5 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-1">
          <h3 className="text-sm font-bold leading-tight hover:text-blue-700 cursor-pointer transition-colors pr-1">
            {listing.name}
          </h3>
          <button
            onClick={() => setFavorited(!favorited)}
            className="shrink-0 mt-0.5"
          >
            <HeartIcon
              filled={favorited}
              className={`w-4 h-4 transition-colors ${
                favorited ? "text-red-500" : "text-slate-300 hover:text-red-400"
              }`}
            />
          </button>
        </div>

        <p className="text-[11px] text-slate-400 mb-3 line-clamp-2 leading-relaxed">
          {listing.description}
        </p>

        <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between">
          {/* Price */}
          <div>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-0.5">
              From
            </p>
            <p className="text-base font-black text-blue-700 leading-none">
              ₹{listing.price.toLocaleString("en-IN")}
              <span className="text-[11px] font-medium text-slate-400">
                /mo
              </span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Save / Bookmark button */}
            <button
              onClick={handleSave}
              disabled={isPending} // ← removed `|| saved`
              className="w-8 h-8 flex items-center justify-center rounded-lg transition-all disabled:opacity-50"
              style={{
                backgroundColor: saved ? "rgba(31,31,224,0.08)" : "transparent",
                border: "1px solid",
                borderColor: saved ? "rgba(31,31,224,0.2)" : "#e2e8f0",
              }}
            >
              <span
                className="material-symbols-outlined text-base transition-all"
                style={{
                  color: saved ? "#1f1fe0" : "#94a3b8",
                  fontVariationSettings: saved ? "'FILL' 1" : "'FILL' 0",
                }}
              >
                {isPending ? "hourglass_empty" : "bookmark"}
              </span>
            </button>

            <Link
              to={`/listingDetail?pgId=${listing.id}&type=single`}
              className="bg-blue-700/10 hover:bg-blue-700 hover:text-white cursor-pointer text-blue-700 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all"
            >
              View Rooms
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
// SEARCH

export default function StayPG() {
  const [isFiltered, setIsFiltered] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [email, setEmail] = useState("");
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = {
    listing_type: searchParams.get("type"),
    maxPrice: searchParams.get("max_price"),
    minPrice: searchParams.get("min_price"),
  };

  const { data, isLoading, error } = useFilteredPg(filters, currentPage);
  const pgListings = data?.data;

  const totalPages = 12;
  const pageNumbers = [1, 2, 3];

  const priceOptions = [
    { label: "₹1k – ₹5k", min: 1000, max: 5000 },
    { label: "₹5k – ₹10k", min: 5000, max: 10000 },
    { label: "₹10k – ₹15k", min: 10000, max: 15000 },
    { label: "₹15k+", min: 15000, max: Infinity },
  ];

  const handleSelected = (option) => {
    setSelectedPrice(option);

    const params = Object.fromEntries(searchParams.entries());
    params.max_price = option.max === Infinity ? "" : option.max;
    params.min_price = option.min;
    setSearchParams(params);
  };

  const PRIMARY = "#1f1fe0";

  const handleCurrentPage = (n) => {
    setCurrentPage(n);
  };

  // ── called when user picks a result from the popup ──
  const handleSearchSelect = (item) => {
    // Option A: show ONLY that one result in the grid
    setPgListings([item]);
    setIsFiltered(true);
  };

  return (
    <div className="min-h-screen bg-[#f6f6f8] text-slate-900 font-sans antialiased">
      {/* ── Header ── */}

      <AllHeader />

      <main className="max-w-7xl mx-auto w-full px-3 sm:px-5 lg:px-10 py-4 sm:py-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1 text-xs text-slate-400 mb-4">
          {["Home", "Near College"].map((crumb) => (
            <span key={crumb} className="flex items-center gap-1">
              <a href="#" className="hover:text-blue-700 transition-colors">
                {crumb}
              </a>
              <svg
                className="w-2.5 h-2.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </span>
          ))}
          <span className="text-slate-600 font-medium">
            PG-Rent Accommodations
          </span>
        </nav>

        {/* Mobile filter toggle */}
        <div className="lg:hidden mb-3">
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm hover:bg-slate-50 transition-colors"
          >
            <FilterIcon className="w-3.5 h-3.5" />
            {filtersOpen ? "Hide Filters" : "Show Filters"}
            {selectedPrice && (
              <span className="ml-1 bg-blue-700 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold">
                1
              </span>
            )}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-5">
          {/* ── Sidebar ── */}
          <aside
            className={`w-full lg:w-52 shrink-0 ${filtersOpen ? "block" : "hidden"} lg:block`}
          >
            <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm lg:sticky lg:top-16">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold">Filters</h3>
                <button
                  onClick={() => {
                    setSelectedPrice(null);

                    // Also clear the price params from the URL
                    const params = Object.fromEntries(searchParams.entries());
                    delete params.max_price;
                    delete params.min_price;
                    setSearchParams(params);
                  }}
                  className="text-[11px] cursor-pointer font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                >
                  Reset
                </button>
              </div>

              {/* Price Range */}
              <div>
                <label className="text-xs font-bold block mb-2.5 text-slate-600 uppercase tracking-wider">
                  Price / mo
                </label>
                <div className="grid grid-cols-2 lg:grid-cols-1 gap-1.5">
                  {priceOptions.map((option, i) => (
                    <button
                      key={i}
                      onClick={() => handleSelected(option)}
                      className={`w-full text-left px-2.5 py-1.5 cursor-pointer rounded-lg text-xs font-medium transition ${
                        selectedPrice?.label === option.label
                          ? "bg-blue-700 text-white"
                          : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* ── Main Content ── */}
          <div className="flex-1 min-w-0">
            {/* Title bar */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight mb-0.5">
                  PGs near College
                </h1>
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 min-h-[120px]">
              {pgListings && pgListings.length > 0 ? (
                pgListings.map((item) => {
                  const listing = {
                    id: item.id,
                    name: item.title,
                    description: item.description,
                    price: Number(item.starting_price),
                    rating: item.avg_rating,
                    img:
                      item.photos?.find((p) => p.isCover)?.url ||
                      item.photos?.[0]?.url || // fallback if no cover is set
                      "https://via.placeholder.com/400",
                    badge: null,
                    tags: [],
                    isSaved: item.isSaved, // ← add this if missing
                  };
                  return <PGCard key={listing.id} listing={listing} />;
                })
              ) : (
                <EmptyState />
              )}
            </div>

            {/* Pagination */}
            <div className="mt-8 flex items-center justify-center gap-1.5">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="w-8 h-8 cursor-pointer rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition-colors"
              >
                <svg
                  className="w-3 h-3"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              {pageNumbers.map((n) => (
                <button
                  key={n}
                  onClick={() => handleCurrentPage(n)}
                  className={`w-8 h-8 rounded-full cursor-pointer font-bold text-xs transition-all ${
                    currentPage === n
                      ? "bg-blue-700 text-white shadow-md shadow-blue-700/30"
                      : "border border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {n}
                </button>
              ))}
              <span className="px-1 text-slate-400 text-sm">…</span>
              <button
                onClick={() => setCurrentPage(totalPages)}
                className={`w-8 h-8 cursor-pointer rounded-full font-bold text-xs border transition-all ${
                  currentPage === totalPages
                    ? "bg-blue-700 text-white border-blue-700 shadow-md shadow-blue-700/30"
                    : "border-slate-200 hover:bg-slate-100"
                }`}
              >
                12
              </button>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                className="w-8 h-8 cursor-pointer rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition-colors"
              >
                <svg
                  className="w-3 h-3"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="bg-slate-900 text-white py-10 px-4 sm:px-6 lg:px-10 mt-12">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1 space-y-3">
            <div className="flex items-center gap-1.5 text-blue-400">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
              <h2 className="text-base font-black tracking-tight text-white">
                StayPG
              </h2>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Making quality shared accommodation accessible for students and
              professionals across India.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-3">Company</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              {["About Us", "Careers", "Privacy Policy", "Terms"].map(
                (item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="hover:text-blue-400 transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ),
              )}
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-3">Cities</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              {["Bangalore", "Pune", "Mumbai", "Delhi"].map((city) => (
                <li key={city}>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    {city}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-3">Newsletter</h4>
            <p className="text-slate-400 text-xs mb-3">
              Get updates on new properties.
            </p>
            <div className="flex bg-slate-800 rounded-full p-0.5">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent border-none focus:ring-0 text-xs flex-1 px-3 py-1.5 outline-none text-white placeholder:text-slate-500"
                placeholder="Your email"
              />
              <button className="bg-blue-700 text-white px-3 py-1.5 rounded-full text-[11px] font-bold hover:bg-blue-800 transition-colors">
                Join
              </button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-3 text-slate-500 text-[11px]">
          <p>© 2024 StayPG Accommodation Pvt Ltd.</p>
          <div className="flex gap-4">
            {["Instagram", "Twitter", "LinkedIn"].map((s) => (
              <a
                key={s}
                href="#"
                className="hover:text-white transition-colors"
              >
                {s}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
