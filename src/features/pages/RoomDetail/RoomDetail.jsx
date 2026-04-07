import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import {
  useFilteredPg,
  usePgById,
  useRooms,
  useRoomsByPg,
} from "../../../hooks/usePgdetail";
import BookingCard from "./BookingCard";
import { SearchOverlay } from "../RoomList/SearchOverlay";

const PRIMARY = "#1f1fe0";

const amenities = [
  { icon: "wifi", label: "Fast WiFi" },
  { icon: "cleaning_services", label: "Cleaning" },
  { icon: "restaurant", label: "Daily Meals" },
  { icon: "fitness_center", label: "Fitness" },
  { icon: "local_laundry_service", label: "Laundry" },
  { icon: "security", label: "Security" },
];

const occupancyTypes = [
  {
    icon: "person",
    label: "Single Occupancy",
    price: "₹18,000",
    type: "single",
  },
  { icon: "group", label: "Double Sharing", price: "₹12,500", type: "double" },
  { icon: "groups", label: "Triple Sharing", price: "₹9,500", type: "tripple" },
];

function Description({ text }) {
  const [expanded, setExpanded] = useState(false);
  const limit = 120;
  const isLong = text?.length > limit;

  return (
    <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
      {expanded || !isLong ? text : `${text.slice(0, limit)}...`}
      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="ml-2 text-blue-600 font-semibold cursor-pointer"
        >
          {expanded ? "Show less" : "Show more"}
        </button>
      )}
    </p>
  );
}

export default function UrbanSanctuary() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isFiltered, setIsFiltered] = useState(false);

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const pgId = searchParams.get("pgId");
  const type = searchParams.get("type") ?? "single";
  const selectedRoom = searchParams.get("roomId") ?? null;

  // ✅ Fix 1: handleType is the only place that sets type params
  const handleType = (selectedType) => {
    setSearchParams({ pgId, type: selectedType });
  };

  // ✅ Fix 2: use replace:true so room clicks don't pollute history
  const setSelectedRoom = (id) => {
    setSearchParams({ pgId, type, roomId: id }, { replace: true });
  };

  const { data, isLoading } = usePgById(pgId);
  const { data: roomData } = useRoomsByPg(pgId, type, currentPage);

  const troom = roomData?.total;

  const { data: room } = useRooms(pgId, type);
  const newocc = room?.result;

  const rooms = roomData?.data?.rooms?.map((r) => {
    const utilities = [];
    if (r.utility_details?.ac) utilities.push({ icon: "ac_unit", label: "AC" });
    if (r.utility_details?.wifi)
      utilities.push({ icon: "wifi", label: "WiFi" });

    return {
      id: r.room_id,
      name: `Room ${r.room_no}`,
      status: r.status === "available" ? "available" : "Unavailable",
      statusColor:
        r.status === "available"
          ? "bg-green-100 text-green-700"
          : "bg-orange-100 text-orange-700",
      price: `₹${r.price_per_month}`,
      tags: [
        { icon: "bed", label: `${r.beds} - Beds available` },
        { icon: "groups", label: `${r.capacity} Person` },
        { icon: "meeting_room", label: r.room_type },
        ...utilities.slice(0, 2),
      ],
      img: r.room_photo?.url || "/room-placeholder.jpg",
    };
  });

  useEffect(() => {
    if (rooms?.length && !selectedRoom) {
      setSelectedRoom(rooms[0].id);
    }
  }, [rooms]);

  // ✅ Fix 1: Removed the duplicate useEffect that was re-setting searchParams on type change

  const counts =
    newocc?.reduce((acc, item) => {
      acc[item.type] = Number(item.total);
      return acc;
    }, {}) || {};

  const prices =
    newocc?.reduce((acc, item) => {
      acc[item.type] = item.price;
      return acc;
    }, {}) || {};

  const totalPages = 12;
  const pageNumbers = [1, 2, 3];

  const listing = data?.data || [];
  const photos = data?.data?.photos || [];

  const handleCurrentPage = (n) => setCurrentPage(n);

  const handleSearchSelect = () => setIsFiltered(true);

  return (
    <div
      className="min-h-screen bg-[#f6f6f8] text-slate-900 antialiased"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <SearchOverlay
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelect={handleSearchSelect}
        navigate={navigate}
      />

      {/* Header */}
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

      <main className="max-w-5xl mx-auto px-4 py-4">
        {/* Breadcrumb — ✅ Fix 3: replaced href="#" with Link */}
        <div className="mb-3 flex items-center gap-1 text-xs text-slate-500">
          <Link to="/" className="hover:underline">
            Home
          </Link>
          <span className="material-symbols-outlined text-xs">
            chevron_right
          </span>
          <Link to="/" className="hover:underline">
            {listing.city}
          </Link>
          <span className="material-symbols-outlined text-xs">
            chevron_right
          </span>
          <span className="text-slate-900 font-medium">
            {listing.address_line1}
          </span>
        </div>

        {/* Photo Grid */}
        <section className="grid grid-cols-4 grid-rows-2 gap-2 h-64 mb-6 max-w-5xl mx-auto">
          <div className="col-span-2 row-span-2 rounded-2xl overflow-hidden bg-slate-200 relative group">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: `url('${photos[0]?.url || ""}')` }}
            />
          </div>
          {photos.slice(1, 3).map((photo, i) => (
            <div
              key={i}
              className="col-span-1 row-span-1 rounded-2xl overflow-hidden bg-slate-200"
            >
              <div
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url('${photo.url}')` }}
              />
            </div>
          ))}
          <div className="col-span-2 row-span-1 rounded-2xl overflow-hidden bg-slate-200">
            <div
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url('${photos[2]?.url || ""}')` }}
            />
          </div>
        </section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-8 space-y-6">
            {/* Title & Description */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-tight">
                  {listing.title}
                </h2>
                <div
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full font-bold text-sm"
                  style={{
                    backgroundColor: "rgba(31,31,224,0.1)",
                    color: PRIMARY,
                  }}
                >
                  <span className="material-symbols-outlined text-sm">
                    star
                  </span>
                  <span className="text-xs">
                    {listing.avg_rating} ({listing.review_count} reviews)
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3 text-slate-500 text-xs">
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">
                    location_on
                  </span>
                  <span className="text-xs">
                    {listing.address_line1}, {listing.city}
                  </span>
                </div>
                <span className="text-slate-300">•</span>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">
                    train
                  </span>
                  <span>800m from college</span>
                </div>
              </div>
              <Description text={listing.description} />
            </div>

            {/* Occupancy Filter */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold">Filter by Occupancy</h3>
                <button className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-slate-200 hover:bg-slate-100 transition-colors">
                  All Units
                </button>
              </div>
              <div className="flex flex-wrap gap-3">
                {occupancyTypes.map((typeItem) => {
                  const isActive = type === typeItem.type;
                  const count = counts[typeItem.type] || 0;
                  return (
                    <button
                      key={typeItem.type}
                      onClick={() => handleType(typeItem.type)}
                      className="flex-1 min-w-[150px] p-4 cursor-pointer rounded-2xl border-2 text-left transition-all"
                      style={{
                        borderColor: isActive ? PRIMARY : "#e2e8f0",
                        backgroundColor: isActive
                          ? "rgba(31,31,224,0.05)"
                          : "transparent",
                      }}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span
                          className="material-symbols-outlined text-xl"
                          style={{ color: isActive ? PRIMARY : "#94a3b8" }}
                        >
                          {typeItem.icon}
                        </span>
                        <span
                          className="text-[10px] font-black px-1.5 py-0.5 rounded-full"
                          style={
                            isActive
                              ? { backgroundColor: PRIMARY, color: "white" }
                              : { backgroundColor: "#e2e8f0", color: "#475569" }
                          }
                        >
                          {count} AVAILABLE
                        </span>
                      </div>
                      <h4 className="font-bold text-xs mb-0.5">
                        {typeItem.label}
                      </h4>
                      <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                        from ₹{prices[typeItem.type] ?? typeItem.price} 🌟
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Room Listings */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold">
                  Available Single Occupancy Units
                </h3>
                <p className="text-xs text-slate-500">
                  Showing {troom} results
                </p>
              </div>

              <div className="grid gap-3">
                {!rooms || rooms.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-slate-200 text-center">
                    <div className="w-16 h-16 flex items-center justify-center rounded-full bg-slate-100 mb-4">
                      <span className="material-symbols-outlined text-3xl text-slate-400">
                        meeting_room
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-1">
                      No Rooms Available
                    </h3>
                    <p className="text-sm text-slate-500 max-w-xs">
                      There are currently no rooms listed for this property.
                      Please check again later or explore other listings.
                    </p>
                    <button
                      onClick={() => window.location.reload()}
                      className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition"
                    >
                      Refresh
                    </button>
                  </div>
                ) : (
                  rooms.map((room) => {
                    const isSelected = selectedRoom === room.id;
                    return (
                      <div
                        key={room.id}
                        onClick={() => setSelectedRoom(room.id)}
                        className="group relative bg-white rounded-2xl p-3 flex gap-4 cursor-pointer transition-all"
                        style={{
                          border: isSelected
                            ? `2px solid ${PRIMARY}`
                            : `1px solid rgba(31,31,224,0.15)`,
                          boxShadow: isSelected
                            ? `0 8px 24px rgba(31,31,224,0.08)`
                            : "none",
                        }}
                      >
                        <div className="w-32 h-24 rounded-xl overflow-hidden flex-shrink-0 relative">
                          <div
                            className={`w-full h-full bg-cover bg-center transition-all duration-500 ${!isSelected ? "grayscale group-hover:grayscale-0" : ""}`}
                            style={{ backgroundImage: `url('${room.img}')` }}
                          />
                        </div>
                        <div className="flex-1 flex flex-col justify-between py-0.5">
                          <div>
                            <div className="flex justify-between items-start mb-1.5">
                              <h4 className="text-sm font-extrabold">
                                {room.name}
                              </h4>
                              <span
                                className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${room.statusColor}`}
                              >
                                {room.status}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-1.5 mb-2">
                              {room.tags.map((tag, index) => {
                                const isBed = tag.icon === "bed";
                                return (
                                  <span
                                    key={index}
                                    className={`px-2 py-0.5 rounded-full text-[9px] font-bold flex items-center gap-1 ${
                                      isBed
                                        ? "bg-blue-100 text-blue-600 border border-blue-300"
                                        : "bg-slate-100 text-slate-500"
                                    }`}
                                  >
                                    <span className="material-symbols-outlined text-[10px]">
                                      {tag.icon}
                                    </span>
                                    {tag.label}
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-baseline gap-1">
                              <span
                                className="text-base font-black"
                                style={{
                                  color: isSelected ? PRIMARY : "#0f172a",
                                }}
                              >
                                {room.price}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                / mo
                              </span>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/roomdetail?id=${room.id}`);
                              }}
                              className="px-3 py-1 bg-slate-900 text-white cursor-pointer rounded-full text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              Details
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 relative self-start">
            <div className="sticky top-14 space-y-3">
              <BookingCard selectedRoom={selectedRoom} />

              <div
                className="rounded-2xl p-4 flex items-center gap-3"
                style={{
                  backgroundColor: "rgba(31,31,224,0.05)",
                  border: "1px solid rgba(31,31,224,0.1)",
                }}
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    backgroundColor: "rgba(31,31,224,0.1)",
                    color: PRIMARY,
                  }}
                >
                  <span className="material-symbols-outlined text-sm">
                    support_agent
                  </span>
                </div>
                <div>
                  <p className="text-xs font-bold">Have questions?</p>
                  <button
                    className="text-xs font-bold hover:underline"
                    style={{ color: PRIMARY }}
                  >
                    Chat with House Manager
                  </button>
                </div>
              </div>

              <div className="h-28 rounded-2xl overflow-hidden border border-slate-200 group relative cursor-pointer">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors z-10" />
                <div
                  className="w-full h-full bg-cover bg-center group-hover:scale-110 transition-transform duration-700"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBxtVDFePDQoUgjU2K8alU9RnbE3imtsDkHCehhs9CEmjZ95CoG80lgFYXp6szoop_TxsMEnMnN1PnTJdewVNw5WKbhpkAXa-vXO5nBZS-ybjlr9RggjxT46lRfpZaGo4GFN8NxDMkmHPpAYZqtZGb28LixUNmqfUx_d76_hetEbWfTU-u2BTc3ZzMfh5HDxXaRnRzTSn00mrtxYtpqfkdDN-nLYrh8trb3Lg4AzAGU3SmrkyNUrotEK_LdnZRHnI2-uecrBrn5Mak')",
                  }}
                />
                <div className="absolute bottom-2.5 left-3 z-20 bg-white px-2.5 py-1 rounded-full flex items-center gap-1.5">
                  <span
                    className="material-symbols-outlined text-xs"
                    style={{ color: PRIMARY }}
                  >
                    map
                  </span>
                  <span className="text-[9px] font-bold text-slate-900 uppercase">
                    View Surroundings
                  </span>
                </div>
              </div>
            </div>
          </aside>
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
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
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

        {/* Amenities */}
        <section className="mt-10 py-6 border-t border-slate-200">
          <h3 className="text-sm font-bold mb-5">Building Amenities</h3>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {amenities.map((amenity) => (
              <div
                key={amenity.label}
                className="flex flex-col items-center gap-1.5 group cursor-pointer"
              >
                <div className="w-11 h-11 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 group-hover:border-[#1f1fe0] group-hover:text-[#1f1fe0] transition-all">
                  <span className="material-symbols-outlined text-xl">
                    {amenity.icon}
                  </span>
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest">
                  {amenity.label}
                </span>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-100 mt-10">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-b border-slate-200 pb-6 mb-4">
            <div
              className="flex items-center gap-1.5"
              style={{ color: PRIMARY }}
            >
              <span className="material-symbols-outlined text-lg font-bold">
                domain
              </span>
              <h1 className="text-sm font-extrabold tracking-tight">
                The Urban Sanctuary
              </h1>
            </div>
            <div className="flex gap-6 text-xs font-medium">
              {[
                "About Us",
                "Careers",
                "Privacy Policy",
                "Terms of Service",
              ].map((link) => (
                <Link
                  key={link}
                  to="/"
                  className="hover:text-[#1f1fe0] transition-colors"
                >
                  {link}
                </Link>
              ))}
            </div>
          </div>
          <p className="text-center text-slate-400 text-xs">
            © 2023 Urban Sanctuary Co-living Private Limited. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
