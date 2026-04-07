import { useState } from "react";
import { useRoomdetails } from "../../../hooks/usePgdetail";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useRoomPrice } from "../../../hooks/useRoomPrice";
import { LayoutGrid } from "lucide-react";

// Add to index.html <head>:
// <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet"/>
// <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
//
// tailwind.config.js:
// theme: { extend: { colors: { primary: "#1f1fe0" }, fontFamily: { display: ["Plus Jakarta Sans"] } } }

const PRIMARY = "#1f1fe0";

const furniture = [
  { icon: "bed", label: "Queen Size Bed" },
  { icon: "chair_alt", label: "Ergonomic Chair" },
  { icon: "desk", label: "Study Table" },
  { icon: "dresser", label: "Large Wardrobe" },
];

const bookingDetails = [
  { icon: "payments", label: "Security Deposit", value: "₹36,000" },
  { icon: "calendar_today", label: "Available From", value: "Oct 1st, 2023" },
  { icon: "history", label: "Minimum Stay", value: "3 Months" },
];

const footerLinks = {
  "Quick Links": ["Find PG", "List Your Property", "About Us"],
  Support: ["Help Center", "Terms of Service", "Privacy Policy"],
};

function RoomDetailsSkeleton() {
  return (
    <section className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-5 animate-pulse">
      {/* Room Specifications */}
      <div>
        <div className="h-4 w-40 bg-slate-200 rounded mb-4"></div>

        <div className="grid grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-3 w-16 bg-slate-200 rounded"></div>
              <div className="h-3 w-24 bg-slate-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Furniture */}
      <div className="pt-4 border-t border-slate-100">
        <div className="h-4 w-32 bg-slate-200 rounded mb-3"></div>

        <div className="flex flex-wrap gap-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-7 w-24 bg-slate-200 rounded-lg"></div>
          ))}
        </div>
      </div>

      {/* Amenities */}
      <div className="pt-4 border-t border-slate-100">
        <div className="h-4 w-32 bg-slate-200 rounded mb-3"></div>

        <div className="grid grid-cols-2 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-start gap-2">
              <div className="w-4 h-4 bg-slate-200 rounded-full"></div>
              <div className="space-y-1">
                <div className="h-3 w-20 bg-slate-200 rounded"></div>
                <div className="h-2 w-28 bg-slate-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Description */}
      <div className="pt-4 border-t border-slate-100 space-y-2">
        <div className="h-4 w-24 bg-slate-200 rounded"></div>
        <div className="h-3 w-full bg-slate-200 rounded"></div>
        <div className="h-3 w-5/6 bg-slate-200 rounded"></div>
      </div>
    </section>
  );
}

const BookingSidebarSkeleton = () => {
  return (
    <aside className="w-full lg:w-[300px]">
      <div className="sticky top-14 space-y-3 animate-pulse">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-lg space-y-4">
          {/* Price */}
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <div className="h-5 w-24 bg-slate-200 rounded" />
              <div className="h-3 w-32 bg-slate-200 rounded" />
            </div>
            <div className="h-5 w-20 bg-slate-200 rounded-full" />
          </div>

          {/* Details */}
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100"
              >
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 bg-slate-200 rounded" />
                  <div className="h-3 w-20 bg-slate-200 rounded" />
                </div>
                <div className="h-3 w-12 bg-slate-200 rounded" />
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="space-y-2 pt-3 border-t border-slate-100">
            <div className="h-10 w-full bg-slate-200 rounded-xl" />
            <div className="h-10 w-full bg-slate-200 rounded-xl" />
          </div>

          <div className="h-3 w-3/4 mx-auto bg-slate-200 rounded" />
        </div>

        {/* Trust Badge */}
        <div className="rounded-xl p-3.5 border flex items-center gap-3 bg-slate-100 border-slate-200">
          <div className="h-6 w-6 bg-slate-200 rounded-full" />
          <div className="space-y-1 w-full">
            <div className="h-3 w-28 bg-slate-200 rounded" />
            <div className="h-3 w-40 bg-slate-200 rounded" />
          </div>
        </div>
      </div>
    </aside>
  );
};
function ImageGallery({ galleryImages = [] }) {
  // State to track if the modal is open and which image is currently selected
  const [selectedIndex, setSelectedIndex] = useState(null);

  if (!galleryImages || galleryImages.length === 0) return null;

  // Navigation handlers
  const openModal = (index) => setSelectedIndex(index);
  const closeModal = () => setSelectedIndex(null);

  const nextImage = (e) => {
    e.stopPropagation();
    setSelectedIndex((prev) =>
      prev === galleryImages.length - 1 ? 0 : prev + 1,
    );
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setSelectedIndex((prev) =>
      prev === 0 ? galleryImages.length - 1 : prev - 1,
    );
  };

  return (
    <div className="w-full">
      {/* --- 1. INITIAL GRID VIEW (50/50 Split Layout) --- */}
      <div className="flex flex-col md:flex-row gap-2 h-[200px] md:h-[260px] w-full">
        {" "}
        {/* LEFT SIDE: BIG IMAGE (50% width) */}
        <div
          className="w-full md:w-1/2 h-full rounded-xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => openModal(0)}
        >
          <img
            src={galleryImages[0]?.url}
            alt="Main view"
            className="w-full h-full object-cover"
          />
        </div>
        {/* RIGHT SIDE: 4 SMALL IMAGES (50% width, 2x2 Grid) */}
        <div className="w-full md:w-1/2 grid grid-cols-2 grid-rows-2 gap-2 h-full">
          {galleryImages.slice(1, 5).map((img, i) => {
            const globalIndex = i + 1;
            const isLastImage = i === 3 && galleryImages.length > 5;

            return (
              <div
                key={globalIndex}
                className="relative w-full h-full rounded-xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => openModal(globalIndex)}
              >
                <img
                  src={img.url}
                  alt={`Gallery thumbnail ${globalIndex}`}
                  className="w-full h-full object-cover"
                />

                {/* OVERLAY FOR THE LAST IMAGE */}
                {isLastImage && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <button className="bg-white text-sm md:text-base px-4 py-2 rounded-full font-medium text-black shadow-sm cursor-pointer hover:bg-gray-100 transition-colors">
                      +{galleryImages.length - 5} all photos
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* --- 2. FULL SCREEN MODAL --- */}
      {selectedIndex !== null && (
        <div className="fixed inset-0 z-50 flex bg-black/95 text-white animate-in fade-in duration-200">
          {/* LEFT SIDE: Large Active Image & Navigation */}
          <div className="flex-1 relative flex items-center justify-center p-4 md:p-12">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-6 left-6 p-2 bg-black/50 hover:bg-black/80 rounded-full transition-colors z-10 cursor-pointer"
            >
              <svg
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>

            {/* Left Arrow */}
            <button
              onClick={prevImage}
              className="absolute left-6 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-colors cursor-pointer"
            >
              <svg
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                ></path>
              </svg>
            </button>

            {/* Main Image */}
            <img
              src={galleryImages[selectedIndex].url}
              alt={`Gallery view ${selectedIndex + 1}`}
              className="max-w-full max-h-full object-contain rounded-lg"
            />

            {/* Right Arrow */}
            <button
              onClick={nextImage}
              className="absolute right-6 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-colors cursor-pointer"
            >
              <svg
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
            </button>
          </div>

          {/* RIGHT SIDE: Row-wise Thumbnail Grid */}
          <div className="w-80 md:w-96 bg-zinc-900 border-l border-zinc-800 flex flex-col">
            <div className="p-6 border-b border-zinc-800">
              <h2 className="text-xl font-semibold">Gallery</h2>
              <p className="text-zinc-400 text-sm mt-1">
                {selectedIndex + 1} of {galleryImages.length} photos
              </p>
            </div>

            {/* Scrollable Thumbnail Area */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="grid grid-cols-2 gap-3">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedIndex(idx)}
                    className={`relative aspect-square rounded-lg overflow-hidden transition-all duration-200 cursor-pointer ${
                      selectedIndex === idx
                        ? "ring-2 ring-white ring-offset-2 ring-offset-zinc-900 opacity-100"
                        : "opacity-50 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default function StayEasyRoom() {
  const [searchParams] = useSearchParams();
  const nagivate = useNavigate();
  const id = searchParams.get("id");
  const { data, isLoading } = useRoomdetails(id);
  const { data: price, isLoading: priceLoading, isError } = useRoomPrice(id);

  if (priceLoading) {
    return <BookingSidebarSkeleton />;
  }

  if (isLoading) {
    return <RoomDetailsSkeleton />;
  }

  const roomData = data?.data;
  console.log("roomdta: ", roomData);

  // Room specification-------
  const specs = [
    {
      label: "Room Size",
      value: roomData?.floor_area_sqm
        ? `${roomData.floor_area_sqm} sq. m`
        : "N/A",
    },
    {
      label: "Floor",
      value: roomData?.floor_number ? `Floor ${roomData.floor_number}` : "N/A",
    },
    {
      label: "Room Number",
      value: roomData?.room_number || "N/A",
    },
    {
      label: "Occupancy",
      value: roomData?.room_type ? `${roomData.room_type} occupancy` : "N/A",
    },
  ];

  // Room ameneties---------
  const amenities = Object.entries(roomData?.utility_details || {})
    .filter(([_, value]) => value === true)
    .map(([key]) => ({
      title: key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      desc: "Available",
    }));

  const galleryImages = roomData?.images ?? [];
  console.log("galary: ", galleryImages);
  const video = roomData?.video?.[0]; // first item

  return (
    <div
      className="min-h-screen bg-[#f6f6f8] text-slate-900 antialiased"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
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
              <h1
                onClick={() => nagivate("/")}
                className="text-sm font-extrabold cursor-pointer tracking-tight"
              >
                StayEasy PG
              </h1>
            </div>
            {/* <nav className="hidden md:flex items-center gap-5">
              {["Properties", "How it works", "Community", "Support"].map(
                (item) => (
                  <a
                    key={item}
                    href="#"
                    className="text-xs font-semibold transition-colors hover:text-[#1f1fe0]"
                  >
                    {item}
                  </a>
                ),
              )}
            </nav> */}
          </div>
          <div className="flex items-center gap-2">
            <button className="p-1.5 rounded-full hover:bg-slate-100 transition-colors">
              <span className="material-symbols-outlined text-lg">search</span>
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
            <div
              className="w-8 h-8 rounded-full bg-cover bg-center ring-2 ring-slate-100"
              style={{
                backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuAHxhdmLkd8w-sh901_qSLkGXBagFqG1MW3k4PLzh4kJFCHX-0_AErGcjqLVK8JhVHDmIW1yy0upnCIn3Q8r3nla4KL_3b9bnav5lHzo4zMKZtqrXWVjkKlCOubd4xe6tpqHIuOUrovY0YRai2cpm__eW_b0bym5bUmykincr8fzq59mQ_nYHhmgH_3vecflQOkITd8ddi6QSXy2nWNM8XpO7aA_NoOu0DUGVYJw6bmCfemgTaL_2goTLyrNHBlbUoC9fwgXzkml5Q")`,
              }}
            />
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-5">
        {/* Breadcrumb */}
        <div className="flex flex-wrap gap-1 mb-4 items-center text-xs">
          <a className="text-slate-500 hover:underline" href="#">
            Home
          </a>
          <span className="material-symbols-outlined text-slate-400 text-xs">
            chevron_right
          </span>
          <a className="text-slate-500 hover:underline" href="#">
            Bangalore Hostels
          </a>
          <span className="material-symbols-outlined text-slate-400 text-xs">
            chevron_right
          </span>
          <span className="font-semibold" style={{ color: PRIMARY }}>
            Room {specs[2].value} - {specs[3].value}
          </span>
        </div>

        <div className="flex flex-col lg:flex-row gap-5">
          {/* Left: Media & Details */}
          <div className="flex-1 space-y-4">
            {/* Video Player */}

            <div
              className="relative rounded-2xl overflow-hidden bg-slate-900 shadow-lg border border-slate-200"
              style={{ aspectRatio: "16/9" }}
            >
              {video ? (
                <video
                  src={video.url}
                  className="w-full h-full object-cover"
                  controls
                  preload="metadata"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-white">
                  No Video Available
                </div>
              )}
            </div>

            {/* Gallery Grid */}
            <ImageGallery galleryImages={galleryImages} />
            {/* Room Specifications */}
            <section className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-5">
              <div>
                <h2 className="text-sm font-bold mb-3 flex items-center gap-1.5">
                  <span
                    className="material-symbols-outlined text-base"
                    style={{ color: PRIMARY }}
                  >
                    straighten
                  </span>
                  Room Specifications
                </h2>
                <div className="grid grid-cols-4 gap-4">
                  {specs.map((spec) => (
                    <div key={spec.label} className="space-y-0.5">
                      <p className="text-slate-500 text-xs">{spec.label}</p>
                      <p className="font-semibold text-xs">{spec.value}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-sm font-bold mb-2">Description</h3>

                <p className="text-slate-600 text-xs leading-relaxed">
                  {roomData?.description || "No description available."}
                </p>
              </div>

              {/* Furniture */}
              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-sm font-bold mb-3">Furniture Included</h3>
                <div className="flex flex-wrap gap-2">
                  {furniture.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-lg"
                    >
                      <span
                        className="material-symbols-outlined text-base"
                        style={{ color: PRIMARY }}
                      >
                        {item.icon}
                      </span>
                      <span className="text-xs font-medium">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-sm font-bold mb-3">Specific Amenities</h3>
                <div className="grid grid-cols-2 gap-3">
                  {amenities.map((item) => (
                    <div key={item.title} className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-emerald-500 text-base mt-0.5">
                        check_circle
                      </span>
                      <div>
                        <p className="font-semibold text-xs">{item.title}</p>
                        <p className="text-slate-500 text-[10px]">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>

          {/* Right: Booking Sidebar */}
          <aside className="w-full lg:w-[300px]">
            <div className="sticky top-14 space-y-3">
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-lg space-y-4">
                {/* Price */}
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-lg font-bold">
                      ₹ {price.price_per_month}
                      <span className="text-xs font-normal text-slate-500">
                        /mo
                      </span>
                    </h2>
                    <p className="text-slate-500 text-xs mt-0.5">
                      All-inclusive pricing
                    </p>
                  </div>
                  <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2.5 py-1 rounded-full">
                    Available
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-2">
                  {bookingDetails.map((detail) => (
                    <div
                      key={detail.label}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100"
                    >
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-slate-400 text-base">
                          {detail.icon}
                        </span>
                        <span className="text-xs">{detail.label}</span>
                      </div>
                      <span className="font-semibold text-xs">
                        {detail.value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Buttons */}
                <div className="space-y-2 pt-3 border-t border-slate-100">
                  <button
                    className="w-full text-white font-bold py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-1.5"
                    style={{
                      backgroundColor: PRIMARY,
                      boxShadow: "0 4px 14px rgba(31,31,224,0.3)",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.opacity = "0.92")
                    }
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                  >
                    Confirm Booking
                    <span className="material-symbols-outlined text-base">
                      arrow_forward
                    </span>
                  </button>
                  <button className="w-full border border-slate-200 hover:bg-slate-50 py-3 rounded-xl font-semibold text-sm transition-all">
                    Schedule a Visit
                  </button>
                </div>

                <p className="text-center text-slate-400 text-[10px]">
                  No credit card required. Secure your spot with an advance
                  deposit.
                </p>
              </div>

              {/* Trust Badge */}
              <div
                className="rounded-xl p-3.5 border flex items-center gap-3"
                style={{
                  backgroundColor: "rgba(31,31,224,0.05)",
                  borderColor: "rgba(31,31,224,0.1)",
                }}
              >
                <span
                  className="material-symbols-outlined text-2xl"
                  style={{ color: PRIMARY }}
                >
                  verified_user
                </span>
                <div>
                  <p className="text-slate-900 font-bold text-xs">
                    StayEasy Verified
                  </p>
                  <p className="text-slate-500 text-[10px]">
                    Property inspected and verified for quality standards.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 mt-8">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="col-span-2 md:col-span-1 space-y-2">
            <div className="flex items-center gap-2" style={{ color: PRIMARY }}>
              <span className="material-symbols-outlined text-lg">
                apartment
              </span>
              <span className="text-sm font-bold text-slate-900">
                StayEasy PG
              </span>
            </div>
            <p className="text-slate-500 text-xs leading-relaxed">
              Redefining modern accommodation for students and professionals
              across India.
            </p>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-bold text-xs mb-3">{title}</h4>
              <ul className="space-y-1.5 text-slate-500 text-xs">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="hover:text-[#1f1fe0] transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="font-bold text-xs mb-3">Contact</h4>
            <ul className="space-y-1.5 text-slate-500 text-xs">
              <li className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-xs">mail</span>
                hello@stayeasy.com
              </li>
              <li className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-xs">call</span>
                +91 98765 43210
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
