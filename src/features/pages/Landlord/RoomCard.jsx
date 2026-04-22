import { useState } from "react";
import EditRoomModal from "./EditRoomModal";

const STATUS_STYLES = {
  available: "bg-emerald-50 text-emerald-600",
  unavailable: "bg-rose-50 text-rose-500",
  occupied: "bg-amber-50 text-amber-600",
};

export default function RoomCard({ room }) {
  const {
    room_number,
    room_type,
    status,
    floor,
    floor_area,
    beds,
    furnished,
    price_per_month,
    currency,
    available_from,
    utility_details,
    room_photo,
    capacity,
  } = room;

  const [open, setOpen] = useState(false);

  const FALLBACK =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBtj_ll0EvahWA2ilfxtrHzindUOyrdnpmq58_4LwhMKf3Cs8vvNqZG0-nd2PvpuQ5eV3nPR7-dlwsJJV3U2Gsn31PaSSA4R8TyKtTA_Dxd2YTqLh7aiPv-Il7HUBjUsFNH5pVILQ0P9QX3gUhIITFAwXewOw6u2ldTBFzT3X-B40quD3HauV16oU0an70jiRifC5scbN6tPKQ-VxoePz__kgmcSz7dGyS80ttxBDCbpxV1Ei6Kj2BSZAa0MGew-BabqZ42hie_2es";

  const statusStyle = STATUS_STYLES[status] || STATUS_STYLES.unavailable;
  const symbol = currency === "INR" ? "₹" : "$";

  return (
    <div className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300">
      {/* Image */}
      <div className="relative aspect-[2/1] overflow-hidden">
        <img
          src={room_photo?.url || FALLBACK}
          alt={room_number}
          onError={(e) => (e.currentTarget.src = FALLBACK)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Status badge */}
        <span
          className={`absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${statusStyle}`}
        >
          {status}
        </span>
        {/* Room type */}
        <span className="absolute top-2.5 right-2.5 bg-slate-900/70 backdrop-blur-sm text-white px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide capitalize">
          {room_type}
        </span>
      </div>

      {/* Body */}
      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold text-slate-900">
            Room {room_number}
          </h3>
          <p className="text-sm font-extrabold text-indigo-600">
            {symbol}
            {price_per_month?.toLocaleString("en-IN")}
            <span className="text-[10px] font-medium text-slate-400">/mo</span>
          </p>
        </div>

        {/* Meta chips */}
        <div className="flex flex-wrap gap-1.5 mb-2.5">
          {[
            { icon: "floor", label: `Floor ${floor}` },
            { icon: "straighten", label: `${floor_area} m²` },
            { icon: "bed", label: `${beds} Bed${beds > 1 ? "s" : ""}` },
            { icon: "group", label: `Cap. ${capacity}` },
            furnished && { icon: "chair", label: "Furnished" },
          ]
            .filter(Boolean)
            .map(({ icon, label }) => (
              <span
                key={label}
                className="flex items-center gap-1 bg-slate-50 border border-slate-100 rounded-lg px-1.5 py-0.5 text-[10px] font-semibold text-slate-600"
              >
                <span className="material-symbols-outlined text-[12px] text-indigo-400">
                  {icon}
                </span>
                {label}
              </span>
            ))}
        </div>

        {/* Utilities */}
        <div className="flex gap-2 mb-3">
          {utility_details?.water_included && (
            <span className="flex items-center gap-1 text-[10px] text-slate-500 font-medium">
              <span className="material-symbols-outlined text-[13px] text-emerald-400">
                water_drop
              </span>
              Water
            </span>
          )}
          {utility_details?.electricity_included && (
            <span className="flex items-center gap-1 text-[10px] text-slate-500 font-medium">
              <span className="material-symbols-outlined text-[13px] text-amber-400">
                bolt
              </span>
              Electricity
            </span>
          )}
          {utility_details?.attached_bathroom && (
            <span className="flex items-center gap-1 text-[10px] text-slate-500 font-medium">
              <span className="material-symbols-outlined text-[13px] text-sky-400">
                bathroom
              </span>
              Bathroom
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-2.5">
          <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
            <span className="material-symbols-outlined text-[12px]">
              calendar_today
            </span>
            From{" "}
            {new Date(available_from).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </div>
          <button
            onClick={() => setOpen(true)}
            className="bg-slate-900 text-white px-2.5 py-1 rounded-lg text-[11px] font-bold hover:bg-indigo-600 transition-colors"
          >
            Edit
          </button>
        </div>
      </div>
      <EditRoomModal isOpen={open} onClose={() => setOpen(false)} room={room} />
    </div>
  );
}
