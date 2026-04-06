import { useRoomPrice } from "../../../hooks/useRoomPrice";

const PRIMARY = "#1f1fe0";

export default function BookingCard({ selectedRoom }) {
  const { data, isLoading, isError } = useRoomPrice(selectedRoom);

  const price = data
    ? `₹${Number(data.price_per_month).toLocaleString("en-IN")}`
    : "—";
  const deposit = data
    ? `₹${Number(data.security_deposit).toLocaleString("en-IN")}`
    : "—";
  const roomNumber = data?.room_number ?? "—";
  const roomType = data?.room_type?.toUpperCase() ?? "—";

  const totalDue = data
    ? Number(data.price_per_month) + Number(data.security_deposit)
    : null;

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-lg shadow-slate-200/50">
      {/* Price header */}
      <div className="flex items-end gap-1.5 mb-4">
        {isLoading ? (
          <div className="h-7 w-24 bg-slate-100 animate-pulse rounded-lg" />
        ) : (
          <>
            <span className="text-xl font-extrabold" style={{ color: PRIMARY }}>
              {price}
            </span>
            <span className="text-slate-500 mb-0.5 text-xs font-medium">
              / month
            </span>
          </>
        )}
      </div>

      <div className="space-y-2.5 mb-4">
        {/* Selected unit badge */}
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
            {isLoading ? (
              <div className="h-4 w-20 bg-slate-100 animate-pulse rounded" />
            ) : (
              <>
                <span className="font-bold text-xs">Room {roomNumber}</span>
                <span
                  className="text-[9px] font-bold bg-white px-1.5 py-0.5 rounded border"
                  style={{ color: PRIMARY, borderColor: "rgba(31,31,224,0.1)" }}
                >
                  {roomType}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Move-in / lock-in */}
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

      {/* Price breakdown */}
      <div className="space-y-2 mb-4 bg-slate-50 p-4 rounded-xl">
        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-4 bg-slate-100 animate-pulse rounded" />
            ))}
          </div>
        ) : isError ? (
          <p className="text-xs text-red-500 text-center">
            Failed to load pricing
          </p>
        ) : (
          <>
            {[
              { label: "Monthly Rent", value: price },
              { label: "Security Deposit", value: deposit },
              { label: "Maintenance Fee", value: "INCLUDED", green: true },
            ].map((item) => (
              <div key={item.label} className="flex justify-between text-xs">
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
              <span className="text-base font-black" style={{ color: PRIMARY }}>
                {totalDue !== null
                  ? `₹${totalDue.toLocaleString("en-IN")}`
                  : "—"}
              </span>
            </div>
          </>
        )}
      </div>

      <button
        className="w-full py-3 text-white rounded-xl font-bold text-sm transition-all mb-3 disabled:opacity-50"
        disabled={isLoading || isError || !data}
        style={{
          backgroundColor: PRIMARY,
          boxShadow: "0 6px 16px rgba(31,31,224,0.25)",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.95)")}
        onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
      >
        Confirm Selection
      </button>

      <p className="text-center text-[9px] text-slate-400 uppercase font-black tracking-widest">
        Zero Processing Fee for Early Birds
      </p>
    </div>
  );
}
