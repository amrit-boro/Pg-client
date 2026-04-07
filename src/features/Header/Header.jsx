import { useState } from "react";
import { SearchOverlay } from "../pages/RoomList/SearchOverlay";
import { Link, useNavigate } from "react-router-dom";

const PRIMARY = "#1f1fe0";

function AllHeader() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [isFiltered, setIsFiltered] = useState(false);

  const navigate = useNavigate();
  const handleSearchSelect = () => setIsFiltered(true);

  return (
    <>
      <SearchOverlay
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelect={handleSearchSelect}
        navigate={navigate}
      />
      <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 h-13 flex items-center justify-between">
          <div className="flex items-center gap-7">
            <div
              className="flex items-center gap-1.5"
              style={{ color: PRIMARY }}
            >
              <span className="material-symbols-outlined text-xl font-bold">
                domain
              </span>
              {/* ✅ Fix 3: use Link instead of onClick navigate */}
              <Link to="/" className="text-sm font-extrabold tracking-tight">
                StayEasy PG
              </Link>
            </div>
            <nav className="hidden md:flex items-center gap-5">
              {/* ✅ Fix 3: replaced href="#" with Link */}
              {["Properties", "How it works", "Community", "Support"].map(
                (item) => (
                  <Link
                    key={item}
                    to="/"
                    className="text-xs font-semibold transition-colors hover:text-[#1f1fe0]"
                  >
                    {item}
                  </Link>
                ),
              )}
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="p-1 rounded-full hover:bg-slate-100 transition-colors"
              onClick={() => setSearchOpen(true)}
            >
              <span className="material-symbols-outlined text-base">
                search
              </span>
            </button>
            <button
              className="px-4 py-1.5 text-white text-xs font-bold rounded-full transition-transform hover:scale-105"
              style={{
                backgroundColor: PRIMARY,
                boxShadow: "0 4px 12px rgba(31,31,224,0.2)",
              }}
            >
              Sign In
            </button>
          </div>
        </div>
      </header>
    </>
  );
}

export default AllHeader;
