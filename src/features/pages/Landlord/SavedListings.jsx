import { useState } from "react";
import { useSavedListings } from "../../../hooks/useSavedlistings";
import ListingCard from "../Guest/ListingCard";

const BADGES = ["Top Rated", null, "Best Seller", null];

function SkeletonCard() {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden animate-pulse">
      <div className="aspect-[4/3] bg-slate-200" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-slate-200 rounded-full w-3/4" />
        <div className="h-3 bg-slate-100 rounded-full w-full" />
        <div className="h-3 bg-slate-100 rounded-full w-2/3" />
        <div className="flex justify-between items-center pt-2 border-t border-slate-100">
          <div className="h-5 bg-slate-200 rounded-full w-20" />
          <div className="h-8 bg-slate-200 rounded-xl w-20" />
        </div>
      </div>
    </div>
  );
}

export default function SavedListings() {
  const [view, setView] = useState("grid");
  const [statusFilter, setStatusFilter] = useState("active");

  const {
    data: listings = [],
    isLoading,
    isError,
    refetch,
  } = useSavedListings();

  return (
    <section className="flex-1 min-w-0">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Saved Listings
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">
            {isLoading ? "Loading..." : `${listings.length} saved properties`}
          </p>
        </div>
        <div className="flex bg-white p-1 rounded-2xl border border-slate-200 self-start sm:self-auto">
          {["Grid", "List"].map((v) => (
            <button
              key={v}
              onClick={() => setView(v.toLowerCase())}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                view === v.toLowerCase()
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Filter - mobile only */}
      <div className="md:hidden mb-4">
        <div className="flex gap-2">
          {[
            { value: "active", label: "Active" },
            { value: "unavailable", label: "Unavailable" },
          ].map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setStatusFilter(value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                statusFilter === value
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-slate-600 border-slate-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Error State */}
      {isError && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <span className="material-symbols-outlined text-4xl text-rose-400 mb-2">
            wifi_off
          </span>
          <p className="text-slate-500 text-sm mb-3">
            Failed to load listings.
          </p>
          <button
            onClick={() => refetch()}
            className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Cards */}
      {!isError && (
        <div
          className={
            view === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3"
              : "flex flex-col gap-3"
          }
        >
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            : listings.map((listing, i) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  badge={BADGES[i % BADGES.length]}
                />
              ))}

          {!isLoading && listings.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
              <span className="material-symbols-outlined text-5xl text-slate-300 mb-3">
                favorite_border
              </span>
              <p className="text-slate-500 font-medium">
                No saved listings yet.
              </p>
              <p className="text-slate-400 text-sm mt-1">
                Start browsing and save your favorites!
              </p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
