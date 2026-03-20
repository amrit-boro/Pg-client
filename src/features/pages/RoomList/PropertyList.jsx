import { useState } from "react";
import { Link } from "react-router-dom";
import ListingSpinner from "../../../ui/ListingSpinner";

function PropertyList({ listings, isLoading, error }) {
  const [favorites, setFavorites] = useState([1, 4]);

  const propertyArray = listings?.data || [];
  console.log("propertyAry: ", propertyArray);

  if (isLoading) return <ListingSpinner size={10} color="blue-500" centered />;

  // 2. Check if the array is empty
  // Inside PropertyList component
  if (propertyArray.length === 0) {
    return (
      <div className="col-span-12 xl:col-span-8 flex flex-col items-center justify-center py-20 text-center lg:pl-40 lg:items-start lg:text-left">
        {/* The icon */}
        <div className="text-7xl mb-6 opacity-80 animate-bounce lg:ml-10">
          🏠
        </div>

        <div className="max-w-md px-4">
          <h3 className="text-2xl font-black text-gray-800 mb-3">
            {listings?.message || "Ooops, room not found ):"}
          </h3>
          <p className="text-gray-500 text-lg leading-relaxed">
            We couldn't find any rooms matching your current price. Try moving
            the slider or clearing your filters!
          </p>

          <button className="mt-8 px-8 py-3 bg-blue-600 text-white font-bold rounded-full shadow-lg hover:bg-blue-700 transition-all">
            Reset All Filters
          </button>
        </div>
      </div>
    );
  }

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id],
    );
  };
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={i} className="text-yellow-500">
          ★
        </span>,
      );
    }
    if (hasHalfStar) {
      stars.push(
        <span key="half" className="text-yellow-500">
          ⯨
        </span>,
      );
    }
    while (stars.length < 5) {
      stars.push(
        <span key={`empty-${stars.length}`} className="text-yellow-500">
          ☆
        </span>,
      );
    }
    return stars;
  };

  return (
    <div className="col-span-12 xl:col-span-8">
      <div className="space-y-6 h-[calc(100vh-13rem)] overflow-y-auto pr-2">
        {propertyArray.map((property) => {
          const imageUrl =
            property.photos && property.photos.length > 0
              ? property.photos[0].url
              : "https://via.placeholder.com/400";

          return (
            <div
              key={property.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex gap-4 hover:shadow-lg hover:border-blue-500/50 transition-all duration-300"
            >
              {/* Image */}
              <div
                className="w-1/3 aspect-[4/3] rounded-lg bg-cover bg-center"
                style={{ backgroundImage: `url(${imageUrl})` }}
              ></div>

              {/* Content */}
              <div className="w-2/3 flex flex-col">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-xs text-blue-500 font-semibold mb-1 capitalize">
                      {property.listing_type.replace("_", " ")}
                    </div>

                    <h4 className="text-lg font-bold">{property.title}</h4>

                    <p className="text-sm text-gray-500">
                      {property.city}, {property.state}
                    </p>
                  </div>

                  <button
                    onClick={() => toggleFavorite(property.id)}
                    className={`transition-colors ${
                      favorites.includes(property.id)
                        ? "text-red-500"
                        : "text-gray-400 hover:text-red-500"
                    }`}
                  >
                    {favorites.includes(property.id) ? "❤️" : "🤍"}
                  </button>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center">
                    {renderStars(property.avg_rating || 0)}
                  </div>
                  <span className="text-xs text-gray-500">
                    ({property.review_count || 0} reviews)
                  </span>
                </div>

                {/* Price */}
                <div className="mt-auto pt-2 flex justify-between items-end">
                  <div>
                    <span className="text-xl font-black text-blue-500">
                      ₹{property.starting_price}
                    </span>
                    <span className="text-sm text-gray-500"> / month</span>
                  </div>

                  <Link
                    to={`/roomDetail/${property.id}`}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-200"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PropertyList;
