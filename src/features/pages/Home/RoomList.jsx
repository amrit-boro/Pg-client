import { Link, useNavigate } from "react-router-dom";
import ListingSpinner from "../../../ui/ListingSpinner";
import { useGetAllPg } from "../../../hooks/usePgdetail";

function RoomList() {
  const { data: pgdetails, isLoading, error } = useGetAllPg();
  const navigate = useNavigate();

  const pgDetails = pgdetails?.data?.data || [];

  if (isLoading) return <ListingSpinner size={10} color="blue-500" centered />;

  if (error)
    return <p className="text-center text-red-500">Something went wrong</p>;

  return (
    <section className="py-6 md:py-10 px-4 sm:px-6 md:px-10 max-w-6xl mx-auto">
      <div className="mb-5 flex flex-col gap-0.5">
        <h2 className="text-gray-900 text-xl sm:text-2xl font-bold tracking-tight">
          Top 4 Listings
        </h2>
      </div>
      <div className="overflow-x-auto scroll-smooth pb-2">
        <div className="flex gap-4 min-w-max sm:min-w-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {pgDetails.map((listing) => {
            const imageUrl =
              listing.photos?.[0]?.url ||
              "https://placehold.co/600x400?text=No+Image";

            return (
              <div
                key={listing.id}
                className="flex flex-col w-56 sm:w-auto rounded-xl bg-white shadow-sm 
            hover:shadow-md overflow-hidden transition-transform 
            hover:-translate-y-1 duration-200"
              >
                {/* Image */}
                <div
                  className="w-full h-32 sm:h-36 bg-cover bg-center"
                  style={{ backgroundImage: `url('${imageUrl}')` }}
                />

                {/* Info */}
                <div className="flex flex-col flex-1 justify-between p-3 gap-2">
                  <div className="flex flex-col gap-1.5">
                    {/* Type + Rating */}
                    <div className="flex items-center justify-between">
                      <span className="bg-blue-100 text-blue-700 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                        {listing.listing_type}
                      </span>
                      {listing.avg_rating && (
                        <span className="text-xs text-yellow-600 font-semibold">
                          ⭐ {Number(listing.avg_rating).toFixed(1)}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-gray-900 font-bold text-sm line-clamp-1">
                      {listing.title}
                    </h3>

                    {/* Address */}
                    <p className="text-gray-400 text-xs truncate">
                      {listing.address_line1}, {listing.city}
                    </p>

                    {/* Price */}
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm font-bold text-gray-900">
                        ₹
                        {Number(listing.starting_price).toLocaleString("en-IN")}
                      </span>
                      <span className="text-xs text-gray-400">/ month</span>
                    </div>
                  </div>
                  {/* 
                  <Link
                    to={`/listingDetail?pgId=${listing.id}&type=single`}
                    className="w-full h-8 rounded-lg bg-blue-50 text-blue-600 
                text-xs font-bold hover:bg-blue-100 
                transition-colors flex items-center justify-center"
                  >
                    View Details
                  </Link> */}
                  <div
                    onClick={() => {
                      navigate(`/listingDetail?pgId=${listing.id}&type=single`);
                    }}
                  >
                    View Details
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default RoomList;
