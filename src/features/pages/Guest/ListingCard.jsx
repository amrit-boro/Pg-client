import { useNavigate } from "react-router-dom";

const FALLBACK_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBtj_ll0EvahWA2ilfxtrHzindUOyrdnpmq58_4LwhMKf3Cs8vvNqZG0-nd2PvpuQ5eV3nPR7-dlwsJJV3U2Gsn31PaSSA4R8TyKtTA_Dxd2YTqLh7aiPv-Il7HUBjUsFNH5pVILQ0P9QX3gUhIITFAwXewOw6u2ldTBFzT3X-B40quD3HauV16oU0an70jiRifC5scbN6tPKQ-VxoePz__kgmcSz7dGyS80ttxBDCbpxV1Ei6Kj2BSZAa0MGew-BabqZ42hie_2es";

export default function ListingCard({ listing, badge }) {
  const navigate = useNavigate();
  const title = listing.ltitle;
  const lid = listing.listing_id;
  console.log("listing_id: ", listing.listing_id);
  const rawPrice = listing?.price_per_month ?? listing?.starting_price;

  const formattedPrice = rawPrice
    ? `₹${Number(rawPrice).toLocaleString("en-IN")}`
    : "N/A";
  return (
    <div className="group bg-white rounded-3xl border border-slate-200 overflow-hidden hover:shadow-2xl hover:shadow-indigo-500/5 transition-all duration-300">
      {/* Image */}
      <div className="relative aspect-[2/1] overflow-hidden">
        <img
          src={listing.url || FALLBACK_IMAGE}
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.currentTarget.src = FALLBACK_IMAGE;
          }}
        />
        {badge && (
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-slate-900 uppercase tracking-wider">
            {badge}
          </div>
        )}
        <button className="absolute top-3 right-3 h-9 w-9 bg-white rounded-full flex items-center justify-center text-rose-500 shadow-lg hover:scale-110 transition-transform">
          <span
            className="material-symbols-outlined text-base"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            favorite
          </span>
        </button>
      </div>

      {/* Body */}
      <div className="p-3">
        <div className="flex justify-between items-start mb-1">
          <h3 className="text-sm font-bold text-slate-900 line-clamp-1 flex-1 mr-2">
            {listing.title}
          </h3>
          <div className="flex items-center gap-0.5 text-amber-500 font-bold text-xs shrink-0">
            <span
              className="material-symbols-outlined text-xs"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              star
            </span>
            {listing.avg_rating}
          </div>
        </div>

        <p className="text-xs text-slate-400 line-clamp-2 mb-3">
          {listing.description}
        </p>

        <div className="flex items-center justify-between border-t border-slate-100 pt-3">
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
              Starts at
            </p>
            <p className="text-base font-extrabold text-indigo-600">
              {formattedPrice}
              <span className="text-xs font-medium text-slate-400">/mo</span>
            </p>
          </div>
          <button
            onClick={() => {
              if (listing.room_type) {
                navigate(`/roomdetail?id=${listing.id}`, {
                  state: { title: title, pgId: lid },
                });
              } else {
                navigate(`/listingDetail?pgId=${listing.id}&type=single`, {
                  state: { title: title },
                });
              }
            }}
            className="bg-blue-600 text-white px-3 py-1.5 cursor-pointer rounded-xl text-xs font-bold hover:bg-indigo-600 transition-colors"
          >
            View Detail
          </button>
        </div>
      </div>
    </div>
  );
}
