import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  useFilteredPg,
  usePgById,
  useRooms,
  useRoomsByPg,
} from "../../../hooks/usePgdetail";
import { dataTagErrorSymbol } from "@tanstack/react-query";

// Add these to your index.html or main entry:
// <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
// <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
//
// Add to your tailwind.config.js:
// theme: { extend: { colors: { primary: "#1f1fe0" }, fontFamily: { display: ["Plus Jakarta Sans"] } } }

const PRIMARY = "#1f1fe0";

// const rooms = [
//   {
//     id: "402",
//     name: "Premium Garden Studio",
//     status: "Ready to Move",
//     statusColor: "bg-green-100 text-green-700",
//     price: "₹18,500",
//     tags: [
//       { icon: "filter_vintage", label: "Garden View" },
//       { icon: "balcony", label: "Large Balcony" },
//       { icon: "desktop_windows", label: "4K Smart TV" },
//     ],
//     img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBpn0cHhztBWp2R25U2WRB00UbqKnmU1oXQ-j7CqxIOPje37rbsrWd00irxu7uHWfWcyqcKKSVtXNhJxOODbXpXXL3pBywS3gs1L9WOPA10yqp9469YJ6SAX25XMcY2raA2-oC1ben4n_CmDFH_gbs6O8vybYBg4KYiyXq5i-OX2HUQ98mQZ3fjsbSXhhSct_huKcGVQs0bagUac0L0bxb1-fZjDqc99Qt7UjwAYeIzXbdVJgYEukr9OzwO9RZ8JVqloCc61wcGk2g",
//   },

//   {
//     id: "305",
//     name: "Executive Corner Suite",
//     status: "Available in 4 days",
//     statusColor: "bg-orange-100 text-orange-700",
//     price: "₹19,000",
//     tags: [
//       { icon: "wb_sunny", label: "East Facing" },
//       { icon: "work", label: "Pro Workspace" },
//     ],
//     img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAUnqAxxMq9fUPDxqbyel9ySt5jVEZ51Ns18rDfCrFbOFsRT3tugDThT6UQw5nfIF0Rs4EoyakmUiz8M63gCk17BACgRS2Q7zYEblaFa9or97qmirYNVB7fDycBOrrA399WIfldN1N_3jb85ceUIJAQiLRdOPy6eRGTJejNlGwSMOHRUch1qqGbemgT2cicwbHhoGBdZlUOLrnvW3Enc3WPur3dQjhkZZcLTjp1Oo5p8v7c9mAIRQ4RwHkf4fGgZOeV63snAeWllic",
//   },
//   {
//     id: "212",
//     name: "Standard Compact Single",
//     status: "Ready to Move",
//     statusColor: "bg-green-100 text-green-700",
//     price: "₹17,500",
//     tags: [{ icon: "chair_alt", label: "Minimalist Decor" }],
//     img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAAwa2cpRHPoj1SryWLkg34fUTAc2kvB5t0kdp9v3jvmAI8O37yMyY4fCw12xgCL19GA_0Hu8wd3aOLpP0Iwpi1J0PxdKD4NQsVcs_UOuI6-NjYuOp6zlkJUNnHPuT1qKgNxrG-BubncWSCZm4xKaGiuv2sgfEwv3nm3ktIJRSzR4oKKYbd9Lguk1EtnRbVpS6R_4oqOwxsIvaDFe6X2x6vePz0IlXziLIRe3aOk6G0AQKSoHgGHqXlUO5IsqfDhSjW23NynjQiOk8",
//   },
// ];

const amenities = [
  { icon: "wifi", label: "Fast WiFi" },
  { icon: "cleaning_services", label: "Cleaning" },
  { icon: "restaurant", label: "Daily Meals" },
  { icon: "fitness_center", label: "Fitness" },
  { icon: "local_laundry_service", label: "Laundry" },
  { icon: "security", label: "Security" },
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
  // const [selectedOccupancy, setSelectedOccupancy] = useState(");
  const [selectedRoom, setSelectedRoom] = useState("402");
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams("single");

  const pgId = searchParams.get("pgId");
  const type = searchParams.get("type");
  const handleType = (selectedType) => {
    setSearchParams({
      pgId: pgId,
      type: selectedType,
    });
  };

  const { data, isLoading, eror } = usePgById(pgId);
  const { data: roomData } = useRoomsByPg(pgId, type);
  // Total room
  console.log("roomdata: ", roomData);

  const troom = roomData?.total;
  // available rooms
  const available = roomData;
  console.log("available: ", available);

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
        { icon: "bed", label: `${r.beds} Beds` },
        { icon: "groups", label: `${r.capacity} Person` },
        { icon: "meeting_room", label: r.room_type },
        ...utilities.slice(0, 2),
      ],

      img: r.room_photo?.url || "/room-placeholder.jpg",
    };
  });

  const occupancyTypes = [
    {
      icon: "person",
      label: "Single Occupancy",
      price: "₹18,000",
      type: "single",
    },
    {
      icon: "group",
      label: "Double Sharing",
      price: "₹12,500",
      type: "double",
    },
    {
      icon: "groups",
      label: "Triple Sharing",
      price: "₹9,500",
      type: "tripple",
    },
  ];
  const counts =
    newocc?.reduce((acc, item) => {
      console.log("account: ", acc, "item; ", item);
      acc[item.type] = Number(item.total);
      return acc;
    }, {}) || {};

  console.log("countes: ", counts);

  const listing = data?.data || [];
  const photos = data?.data?.photos || [];
  // const selectedRoomData = rooms.find((r) => r.id === selectedRoom) || rooms[0];

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
              y
              style={{ color: PRIMARY }}
            >
              <span className="material-symbols-outlined text-xl font-bold">
                domain
              </span>
              <h1 className="text-sm font-extrabold tracking-tight">
                StayEasy PG
              </h1>
            </div>
            <nav className="hidden md:flex items-center gap-5">
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
            </nav>
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

      <main className="max-w-5xl mx-auto px-4 py-4">
        {/* Breadcrumb */}
        <div className="mb-3 flex items-center gap-1 text-xs text-slate-500">
          <a href="#" className="hover:underline">
            Home
          </a>
          <span className="material-symbols-outlined text-xs">
            chevron_right
          </span>
          <a href="#" className="hover:underline">
            Bangalore
          </a>
          <span className="material-symbols-outlined text-xs">
            chevron_right
          </span>
          <span className="text-slate-900 font-medium">
            Koramangala 4th Block
          </span>
        </div>

        {/* Photo Grid */}
        {/* <section className="grid grid-cols-4 grid-rows-2 gap-2 h-64 mb-6 max-w-5xl mx-auto">
          <div className="col-span-2 row-span-2 rounded-2xl overflow-hidden bg-slate-200 relative group">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAO1mNXxyCqS0-lrGYaybpGpzust7teIdCn_yZdNla7e441pgrr2VAJ8gvMviMmXZ4Z8bOK8ogZnE4Sg5pe0o41i4C8mCvllvH5ucovC6MKPBTn2RWygj8tc-7CMHBKXpycPPs2bOtByG6FnhMMU1Cl2cXy_-3pitfNVhfegh_tjsZivTsMeoHayFTPodjTYd-vqGicaBUnAq9CPMsdYp7VfNauft5oe5cfE2EWa8gwkgeeIK5De5r2p0fEfH0l5ZzyR7O7tFRc-Zg')",
              }}
            />
            <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur rounded-full px-3 py-1 flex items-center gap-1">
              <span
                className="material-symbols-outlined text-sm"
                style={{ color: PRIMARY }}
              >
                photo_camera
              </span>
              <span className="text-[10px] font-bold text-slate-900">
                Show all photos
              </span>
            </div>
          </div>
          {[
            "https://lh3.googleusercontent.com/aida-public/AB6AXuAUnqAxxMq9fUPDxqbyel9ySt5jVEZ51Ns18rDfCrFbOFsRT3tugDThT6UQw5nfIF0Rs4EoyakmUiz8M63gCk17BACgRS2Q7zYEblaFa9or97qmirYNVB7fDycBOrrA399WIfldN1N_3jb85ceUIJAQiLRdOPy6eRGTJejNlGwSMOHRUch1qqGbemgT2cicwbHhoGBdZlUOLrnvW3Enc3WPur3dQjhkZZcLTjp1Oo5p8v7c9mAIRQ4RwHkf4fGgZOeV63snAeWllic",
            "https://lh3.googleusercontent.com/aida-public/AB6AXuB5G2wc6rae3GUjvwiGQC709oQDmsbdDdGvjkZqjnvx50tMNG9rsM_7kdv-eTYdPf0ci7fJf5L-67XiGT0VsDUJjeO20AIsapH_mPeqvfKjWYyS55tHfjruAWyNb4wpvu61vonG0N8qWWYXduQzVU3nGAShru8BnZEjJ6CNs97x6i7QEwj3PU2OypC_g4EJBoeBBx8tGfa3BQYdKrmnKFG5P_KtzB2fi8fmknTtucoTvOmWqsDK-mEf0DFH7K-YmCQf7kT9nlLoeT8",
          ].map((url, i) => (
            <div
              key={i}
              className="col-span-1 row-span-1 rounded-2xl overflow-hidden bg-slate-200"
            >
              <div
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url('${url}')` }}
              />
            </div>
          ))}
          <div className="col-span-2 row-span-1 rounded-2xl overflow-hidden bg-slate-200">
            <div
              className="w-full h-full bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCFgYhadD7TjTz-1EP8I5qorQ5SRxPoQplH7ehRERNiwVq60zhGKGIjETsehLoUd-5QX9CzcVOI__aNiqtla5B4jkDvEQN1kaQWJm0pi610v5N7ovWdymDdP1Ahe2K0OIODuoEF5-Rp-phJAjs6YXp3hheZ7xU5vBkj_2nU5_5yFg20C28UKlaITO7d_RSLg83Mhi98UnCum8PZhVMsJQ1oW4PRQGC3yCCvLjIIppX1BPvxhRtWESYP6ghKG0zI4DvFZ1hN4Egd54Q')",
              }}
            />
          </div>
        </section> */}
        <section className="grid grid-cols-4 grid-rows-2 gap-2 h-64 mb-6 max-w-5xl mx-auto">
          <div className="col-span-2 row-span-2 rounded-2xl overflow-hidden bg-slate-200 relative group">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{
                backgroundImage: `url('${photos[0]?.url || ""}')`,
              }}
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
              style={{
                backgroundImage: `url('${photos[2]?.url || ""}')`,
              }}
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
                  <span className="text-xs">4.9 (124 reviews)</span>
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
                        from {typeItem.price} 🌟🌟
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
                    {/* Icon */}
                    <div className="w-16 h-16 flex items-center justify-center rounded-full bg-slate-100 mb-4">
                      <span className="material-symbols-outlined text-3xl text-slate-400">
                        meeting_room
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-slate-800 mb-1">
                      No Rooms Available
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-slate-500 max-w-xs">
                      There are currently no rooms listed for this property.
                      Please check again later or explore other listings.
                    </p>

                    {/* Action */}
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
                            : "1px solid #e2e8f0",
                          boxShadow: isSelected
                            ? `0 8px 24px rgba(31,31,224,0.08)`
                            : "none",
                        }}
                      >
                        {/* Image */}
                        <div className="w-32 h-24 rounded-xl overflow-hidden flex-shrink-0 relative">
                          <div
                            className={`w-full h-full bg-cover bg-center transition-all duration-500 ${
                              !isSelected
                                ? "grayscale group-hover:grayscale-0"
                                : ""
                            }`}
                            style={{
                              backgroundImage: `url('${room.img}')`,
                            }}
                          />
                        </div>

                        {/* Room Info */}
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

                            {/* Tags */}
                            <div className="flex flex-wrap gap-1.5 mb-2">
                              {room.tags.map((tag, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-0.5 bg-slate-100 rounded-full text-[9px] font-bold text-slate-500 flex items-center gap-1"
                                >
                                  <span className="material-symbols-outlined text-[10px]">
                                    {tag.icon}
                                  </span>
                                  {tag.label}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Price */}
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
          <aside className="lg:col-span-4 relative">
            <div className="sticky top-16 space-y-3">
              {/* Booking Card */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-lg shadow-slate-200/50">
                <div className="flex items-end gap-1.5 mb-4">
                  <span
                    className="text-xl font-extrabold"
                    style={{ color: PRIMARY }}
                  >
                    100
                  </span>
                  <span className="text-slate-500 mb-0.5 text-xs font-medium">
                    / month
                  </span>
                </div>

                <div className="space-y-2.5 mb-4">
                  <div
                    className="p-3 rounded-xl flex flex-col gap-0.5"
                    style={{
                      backgroundColor: "rgba(31,31,224,0.05)",
                      border: "1px solid rgba(31,31,224,0.2)",
                    }}
                  >
                    <span
                      className="text-[9px] font-black uppercase tracking-widest"
                      style={{ color: "rgba(31,31,224,0.6)" }}
                    >
                      Selected Unit
                    </span>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-xs">Room ***</span>
                      <span
                        className="text-[9px] font-bold bg-white px-1.5 py-0.5 rounded border"
                        style={{
                          color: PRIMARY,
                          borderColor: "rgba(31,31,224,0.1)",
                        }}
                      >
                        SINGLE
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: "Move-in Date", value: "Oct 12, 2023" },
                      { label: "Min Lock-in", value: "3 Months" },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="p-2.5 rounded-xl border border-slate-200 flex flex-col gap-0.5"
                      >
                        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                          {item.label}
                        </span>
                        <span className="font-bold text-xs">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 mb-4 bg-slate-50 p-4 rounded-xl">
                  {[
                    { label: "Monthly Rent", value: 100 },
                    { label: "Security Deposit (2 Mo)", value: "₹37,000" },
                    {
                      label: "Maintenance Fee",
                      value: "INCLUDED",
                      green: true,
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex justify-between text-xs"
                    >
                      <span className="text-slate-500">{item.label}</span>
                      <span
                        className={`font-bold ${item.green ? "text-green-600" : ""}`}
                      >
                        {item.value}
                      </span>
                    </div>
                  ))}
                  <div className="border-t border-slate-200 pt-2 mt-2 flex justify-between items-center">
                    <span className="font-extrabold text-slate-900 uppercase tracking-tighter text-xs">
                      Total Due Today
                    </span>
                    <span
                      className="text-base font-black"
                      style={{ color: PRIMARY }}
                    >
                      ₹55,500
                    </span>
                  </div>
                </div>

                <button
                  className="w-full py-3 text-white rounded-xl font-bold text-sm transition-all mb-3"
                  style={{
                    backgroundColor: PRIMARY,
                    boxShadow: "0 6px 16px rgba(31,31,224,0.25)",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "scale(1.02)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                  onMouseDown={(e) =>
                    (e.currentTarget.style.transform = "scale(0.95)")
                  }
                  onMouseUp={(e) =>
                    (e.currentTarget.style.transform = "scale(1.02)")
                  }
                >
                  Confirm Selection
                </button>
                <p className="text-center text-[9px] text-slate-400 uppercase font-black tracking-widest">
                  Zero Processing Fee for Early Birds
                </p>
              </div>

              {/* Chat Widget */}
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

              {/* Map Preview */}
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
                <a
                  key={link}
                  href="#"
                  className="hover:text-[#1f1fe0] transition-colors"
                >
                  {link}
                </a>
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
