import { useRoomPrice } from "../../../hooks/useRoomPrice";

const PRIMARY = "#1f1fe0";
function BookingCard({ selectedRoom }) {
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

  const bookingDetails = [
    { label: "Room Type", icon: "bed", value: roomType },
    { label: "Monthly Rent", icon: "payments", value: price },
    { label: "Security Deposit", icon: "lock", value: deposit },
    {
      label: "Total Due",
      icon: "receipt_long",
      value: totalDue ? `₹${totalDue.toLocaleString("en-IN")}` : "—",
    },
  ];

  return (
    <aside className="w-full lg:w-[300px]">
      <div className="sticky top-14 space-y-3">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-lg space-y-4">
          {/* Price */}
          <div className="flex justify-between items-start">
            <div>
              {isLoading ? (
                <>
                  <div className="h-6 w-24 bg-slate-200 animate-pulse rounded mb-1" />
                  <div className="h-3 w-28 bg-slate-100 animate-pulse rounded" />
                </>
              ) : (
                <>
                  <h2 className="text-lg font-bold">
                    {price}
                    <span className="text-xs font-normal text-slate-500">
                      /mo
                    </span>
                  </h2>
                  <p className="text-slate-500 text-xs mt-0.5">
                    All-inclusive pricing
                  </p>
                </>
              )}
            </div>

            <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2.5 py-1 rounded-full">
              {isLoading ? "..." : "Available"}
            </span>
          </div>

          {/* Selected Unit */}
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
                {isLoading ? (
                  <>
                    <div className="h-4 w-20 bg-slate-200 animate-pulse rounded" />
                    <div className="h-4 w-12 bg-slate-200 animate-pulse rounded" />
                  </>
                ) : (
                  <>
                    <span className="font-bold text-xs">Room {roomNumber}</span>
                    <span
                      className="text-[9px] font-bold bg-white px-1.5 py-0.5 rounded border"
                      style={{
                        color: PRIMARY,
                        borderColor: "rgba(31,31,224,0.1)",
                      }}
                    >
                      Active
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-2">
            {isLoading
              ? Array(4)
                  .fill(0)
                  .map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100"
                    >
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 bg-slate-200 animate-pulse rounded" />
                        <div className="h-3 w-20 bg-slate-200 animate-pulse rounded" />
                      </div>
                      <div className="h-3 w-16 bg-slate-200 animate-pulse rounded" />
                    </div>
                  ))
              : bookingDetails.map((detail) => (
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
              disabled={isLoading}
              className="w-full text-white font-bold py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-1.5 disabled:opacity-60"
              style={{
                backgroundColor: PRIMARY,
                boxShadow: "0 4px 14px rgba(31,31,224,0.3)",
              }}
            >
              {isLoading ? "Loading..." : "Confirm Booking"}
            </button>

            <button
              disabled={isLoading}
              className="w-full border border-slate-200 py-3 rounded-xl font-semibold text-sm disabled:opacity-60"
            >
              Schedule a Visit
            </button>
          </div>

          <p className="text-center text-slate-400 text-[10px]">
            No credit card required. Secure your spot with an advance deposit.
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
  );
}

export default BookingCard;
