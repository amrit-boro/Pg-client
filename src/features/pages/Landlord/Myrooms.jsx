import { useState } from "react";
import { useRooms } from "../../../hooks/useRooms";
import RoomCard from "./RoomCard";

// 🔁 Replace with actual listing ID (from auth context / route param)
const LISTING_ID = "dc5c1ef5-6302-4181-83c4-2aa2a9cfd822";

const ROOM_TYPES = [
  { value: "single", label: "Single", icon: "person" },
  { value: "double", label: "Double", icon: "group" },
  { value: "triple", label: "Triple", icon: "groups" },
];

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden animate-pulse">
      <div className="aspect-[2/1] bg-slate-200" />
      <div className="p-3 space-y-2">
        <div className="flex justify-between">
          <div className="h-3.5 bg-slate-200 rounded-full w-24" />
          <div className="h-3.5 bg-slate-200 rounded-full w-16" />
        </div>
        <div className="flex gap-1.5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-5 bg-slate-100 rounded-lg w-14" />
          ))}
        </div>
        <div className="flex gap-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="h-3.5 bg-slate-100 rounded-full w-14" />
          ))}
        </div>
        <div className="flex justify-between pt-2 border-t border-slate-100">
          <div className="h-3 bg-slate-100 rounded-full w-24" />
          <div className="h-6 bg-slate-200 rounded-lg w-16" />
        </div>
      </div>
    </div>
  );
}

function EmptyState({ type }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4">
        <span className="material-symbols-outlined text-3xl text-indigo-300">
          door_front
        </span>
      </div>
      <p className="text-slate-600 font-semibold text-sm">
        No {type} rooms listed yet
      </p>
      <p className="text-slate-400 text-xs mt-1 mb-5">
        Add your first {type} room to start getting bookings
      </p>
      <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors shadow-lg shadow-indigo-200">
        <span className="material-symbols-outlined text-sm">add</span>
        Create your first room
      </button>
    </div>
  );
}

export default function MyRooms() {
  const [activeType, setActiveType] = useState("single");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, refetch } = useRooms({
    listingId: LISTING_ID, ///// update
    type: activeType,
    page,
  });
  console.log("type:", activeType);

  const rooms = data?.data?.rooms || [];
  const total = data?.total ?? 0;

  const handleTypeChange = (type) => {
    setActiveType(type);
    setPage(1);
  };

  return (
    <div className="flex-1 min-w-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            My Rooms
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">
            {isLoading
              ? "Loading..."
              : `${total} ${activeType} room${total !== 1 ? "s" : ""} listed`}
          </p>
        </div>
        <button className="flex items-center gap-1.5 self-start sm:self-auto bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-xl text-xs font-bold transition-colors shadow-lg shadow-indigo-200">
          <span className="material-symbols-outlined text-sm">add</span>
          Add Room
        </button>
      </div>

      {/* Room Type Tabs */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        {ROOM_TYPES.map(({ value, label, icon }) => (
          <button
            key={value}
            onClick={() => handleTypeChange(value)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
              activeType === value
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            <span className="material-symbols-outlined text-sm">{icon}</span>
            {label}
          </button>
        ))}
      </div>

      {/* Error */}
      {isError && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <span className="material-symbols-outlined text-4xl text-rose-400 mb-2">
            wifi_off
          </span>
          <p className="text-slate-500 text-sm mb-3">Failed to load rooms.</p>
          <button
            onClick={() => refetch()}
            className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Grid */}
      {!isError && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          ) : rooms.length === 0 ? (
            <EmptyState type={activeType} />
          ) : (
            rooms.map((room) => <RoomCard key={room.room_id} room={room} />)
          )}
        </div>
      )}

      {/* Pagination */}
      {!isLoading && rooms.length > 0 && (
        <div className="mt-8 flex justify-center">
          <nav className="flex items-center gap-1.5">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="h-9 w-9 flex items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:bg-white transition-colors disabled:opacity-40"
            >
              <span className="material-symbols-outlined text-base">
                chevron_left
              </span>
            </button>
            <span className="h-9 px-4 flex items-center justify-center rounded-xl bg-indigo-600 text-white text-sm font-bold shadow-md shadow-indigo-200">
              {page}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={rooms.length < 10}
              className="h-9 w-9 flex items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:bg-white transition-colors disabled:opacity-40"
            >
              <span className="material-symbols-outlined text-base">
                chevron_right
              </span>
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}
