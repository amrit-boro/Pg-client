import { useState } from "react";

function OccupancySelector({ roomCounts, PRIMARY }) {
  const [type, setType] = useState("single");

  // Convert API array → object counts
  const counts = roomCounts?.reduce(
    (acc, item) => {
      acc[item.room_type] = Number(item.total);
      return acc;
    },
    { single: 0, double: 0, triple: 0 },
  ) || {
    single: 0,
    double: 0,
    triple: 0,
  };

  return (
    <div className="flex flex-wrap gap-3">
      {/* SINGLE */}
      <button
        onClick={() => setType("single")}
        className="flex-1 min-w-[150px] p-4 rounded-2xl border-2 text-left transition-all"
        style={{
          borderColor: type === "single" ? PRIMARY : "#e2e8f0",
          backgroundColor:
            type === "single" ? "rgba(31,31,224,0.05)" : "transparent",
        }}
      >
        <div className="flex justify-between items-start mb-2">
          <span
            className="material-symbols-outlined text-xl"
            style={{ color: type === "single" ? PRIMARY : "#94a3b8" }}
          >
            person
          </span>

          <span
            className="text-[10px] font-black px-1.5 py-0.5 rounded-full"
            style={
              type === "single"
                ? { backgroundColor: PRIMARY, color: "white" }
                : { backgroundColor: "#e2e8f0", color: "#475569" }
            }
          >
            {counts.single} AVAILABLE
          </span>
        </div>

        <h4 className="font-bold text-xs mb-0.5">Single Occupancy</h4>

        <p className="text-[10px] text-slate-500 uppercase font-bold">
          from ₹18,000 🌟🌟
        </p>
      </button>

      {/* DOUBLE */}
      <button
        onClick={() => setType("double")}
        className="flex-1 min-w-[150px] p-4 rounded-2xl border-2 text-left transition-all"
        style={{
          borderColor: type === "double" ? PRIMARY : "#e2e8f0",
          backgroundColor:
            type === "double" ? "rgba(31,31,224,0.05)" : "transparent",
        }}
      >
        <div className="flex justify-between items-start mb-2">
          <span
            className="material-symbols-outlined text-xl"
            style={{ color: type === "double" ? PRIMARY : "#94a3b8" }}
          >
            group
          </span>

          <span
            className="text-[10px] font-black px-1.5 py-0.5 rounded-full"
            style={
              type === "double"
                ? { backgroundColor: PRIMARY, color: "white" }
                : { backgroundColor: "#e2e8f0", color: "#475569" }
            }
          >
            {counts.double} AVAILABLE
          </span>
        </div>

        <h4 className="font-bold text-xs mb-0.5">Double Sharing</h4>

        <p className="text-[10px] text-slate-500 uppercase font-bold">
          from ₹12,500 🌟🌟
        </p>
      </button>

      {/* TRIPLE */}
      <button
        onClick={() => setType("triple")}
        className="flex-1 min-w-[150px] p-4 rounded-2xl border-2 text-left transition-all"
        style={{
          borderColor: type === "triple" ? PRIMARY : "#e2e8f0",
          backgroundColor:
            type === "triple" ? "rgba(31,31,224,0.05)" : "transparent",
        }}
      >
        <div className="flex justify-between items-start mb-2">
          <span
            className="material-symbols-outlined text-xl"
            style={{ color: type === "triple" ? PRIMARY : "#94a3b8" }}
          >
            groups
          </span>

          <span
            className="text-[10px] font-black px-1.5 py-0.5 rounded-full"
            style={
              type === "triple"
                ? { backgroundColor: PRIMARY, color: "white" }
                : { backgroundColor: "#e2e8f0", color: "#475569" }
            }
          >
            {counts.triple} AVAILABLE
          </span>
        </div>

        <h4 className="font-bold text-xs mb-0.5">Triple Sharing</h4>

        <p className="text-[10px] text-slate-500 uppercase font-bold">
          from ₹9,500 🌟🌟
        </p>
      </button>
    </div>
  );
}

export default OccupancySelector;
