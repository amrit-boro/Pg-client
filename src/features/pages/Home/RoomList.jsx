import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getAllPg } from "../../../services/apiPGs";
import ListingSpinner from "../../../ui/ListingSpinner";
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import { useGetAllPg } from "../../../hooks/usePgdetail";

function RoomList() {
  const { data: pgdetails, isLoading, error } = useGetAllPg();

  const pgDetails = pgdetails?.data?.data || [];

  if (isLoading) return <ListingSpinner size={10} color="blue-500" centered />;

  if (error)
    return <p className="text-center text-red-500">Something went wrong</p>;

  return (
    <section className="py-8 md:py-14 px-4 sm:px-6 md:px-10 max-w-6xl mx-auto">
      <h2 className="text-gray-900 text-2xl sm:text-3xl font-bold mb-6">
        Featured Listings
      </h2>

      <div className="overflow-x-auto scroll-smooth">
        <div className="flex gap-6 min-w-max">
          {pgDetails.slice(0, 5).map((listing) => {
            // ✅ Correct photo extraction
            const imageUrl =
              listing.photos?.[0]?.url ||
              "https://placehold.co/600x400?text=No+Image";

            return (
              <div
                key={listing.id}
                className="flex flex-col w-64 md:w-72 rounded-xl bg-white shadow-sm 
                hover:shadow-md overflow-hidden transition-transform 
                hover:-translate-y-1 duration-200"
              >
                {/* Image */}
                <div
                  className="w-full h-40 md:h-48 bg-cover bg-center"
                  style={{
                    backgroundImage: `url('${imageUrl}')`,
                  }}
                />

                {/* Info */}
                <div className="flex flex-col flex-1 justify-between p-4 gap-3">
                  <div className="flex flex-col gap-2">
                    {/* Type + Rating */}
                    <div className="flex items-center justify-between">
                      <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide">
                        {listing.listing_type}
                      </span>

                      {listing.avg_rating && (
                        <span className="text-sm text-yellow-600 font-semibold">
                          ⭐ {Number(listing.avg_rating).toFixed(1)}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-gray-900 font-bold text-lg line-clamp-1">
                      {listing.title}
                    </h3>

                    {/* Address */}
                    <p className="text-gray-500 text-sm truncate">
                      {listing.address_line1}, {listing.city}
                    </p>

                    {/* Price */}
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-lg font-bold text-gray-900">
                        ₹
                        {Number(listing.starting_price).toLocaleString("en-IN")}
                      </span>
                      <span className="text-sm text-gray-500">/ month</span>
                    </div>
                  </div>

                  <Link
                    to={`/roomDetail/${listing.id}`}
                    className="w-full h-10 rounded-lg bg-blue-50 text-blue-600 
                    text-sm font-bold hover:bg-blue-100 
                    transition-colors flex items-center justify-center"
                  >
                    View Details
                  </Link>
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
