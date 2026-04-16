import React, { useState, useMemo } from "react";
import Lsidebar from "./Lsidebar";
import { Link } from "react-router-dom";
import Landlordheader from "./Landlordheader";
import { usePgdetail } from "../../../hooks/usePgdetail";

// 1. Helper Component for Icons
const Icon = ({ name, className = "" }) => (
  <span
    className={`material-symbols-outlined ${className}`}
    style={{
      fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24",
      fontSize: "24px",
    }}
  >
    {name}
  </span>
);

// 2. Updated PropertyCard to handle your API's specific status
const PropertyCard = ({ property }) => {
  const statusColors = {
    Listed: "bg-green-100 text-green-800",
    Unlisted: "bg-yellow-100 text-yellow-800",
    Booked: "bg-blue-100 text-blue-800",
    // Add the status from your backend here
    Available: "bg-green-100 text-green-800",
  };

  // Fallback for unknown statuses
  const statusClass =
    statusColors[property.status] || "bg-gray-100 text-gray-800";

  return (
    <div className="flex flex-col gap-3 pb-3 bg-white rounded-xl border border-gray-200 overflow-hidden group transition-shadow hover:shadow-lg">
      <div
        className="w-full bg-center bg-no-repeat aspect-video bg-cover"
        // Use the mapped image URL
        style={{ backgroundImage: `url("${property.image}")` }}
      />
      <div className="px-4">
        <p className="text-gray-900 text-base font-bold leading-normal">
          {property.name}
        </p>
        <p className="text-gray-500 text-sm font-normal leading-normal">
          {property.address}
        </p>
        <div className="mt-2 flex items-center gap-2">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusClass}`}
          >
            {property.status}
          </span>
        </div>
      </div>
      <div className="px-4 pt-2 pb-4 mt-auto flex gap-2">
        <button className="flex-1 h-9 rounded-lg text-sm font-bold bg-blue-100 text-blue-600 hover:bg-blue-200">
          Edit
        </button>
        <button className="flex-1 h-9 rounded-lg text-sm font-bold bg-gray-100 text-gray-800 hover:bg-gray-200">
          View
        </button>
      </div>
    </div>
  );
};

export default function LandlordProfile() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const x = usePgdetail();
  console.log("get full detail: ", x);

  const { pgdetail, isLoading } = usePgdetail();

  console.log("pgDetail: ", pgdetail);
  // 3. Transform API Data to UI Format
  const listings = useMemo(() => {
    const pgData = pgdetail?.data?.pg;

    if (!pgData) return [];

    // Handle if 'pg' is a single object (as per screenshot) or an array
    const dataArray = Array.isArray(pgData) ? pgData : [pgData];

    return dataArray.map((item) => ({
      id: item.property_id, // Mapping property_id -> id
      name: item.title, // Mapping title -> name
      // Construct address from multiple fields
      address: `${item.areaname}, ${item.city}`,
      status: item.status,
      // Construct Image URL.
      // NOTE: Replace 'http://localhost:YOUR_PORT' with your actual backend URL
      image:
        item.images && item.images.length > 0
          ? `${import.meta.env.VITE_API_URL}/${item.images[0]}`
          : "https://via.placeholder.com/400",
    }));
  }, [pgdetail]);

  // Filter logic now runs on the transformed 'listings'
  const filteredProperties = listings.filter((property) => {
    const matchesSearch =
      property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      activeFilter === "All" || property.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  // Dynamic filters based on actual data statuses + standard ones
  const filters = ["All", "Available", "Listed", "Unlisted", "Booked"];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading properties...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined"
        rel="stylesheet"
      />
      <Landlordheader />

      <div className="flex min-h-screen w-full">
        <Lsidebar />
        <main className="flex-1 p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex flex-col gap-1">
                <p className="text-gray-900 text-3xl font-bold leading-tight tracking-tight">
                  Your Property Listings
                </p>
                <p className="text-gray-500 text-base font-normal leading-normal">
                  Manage, edit, and view all your properties in one place.
                </p>
              </div>
              <div className="self-start -mt-1">
                <Link
                  to="/"
                  className="px-3 py-2 rounded-md bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
                >
                  Home
                </Link>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              <div className="flex-grow">
                <div className="flex w-full items-stretch rounded-lg h-12 border border-gray-200 bg-white">
                  <div className="text-gray-500 flex items-center justify-center pl-4">
                    <Icon name="search" />
                  </div>
                  <input
                    className="flex w-full min-w-0 flex-1 rounded-r-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white h-full placeholder:text-gray-400 px-4 text-base font-normal leading-normal border-0"
                    placeholder="Search by property name or address"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {filters.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`flex h-12 shrink-0 items-center justify-center gap-x-2 rounded-lg px-4 ${
                      activeFilter === filter
                        ? "bg-blue-50 text-blue-600"
                        : "bg-white border border-gray-200 hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    <p className="text-sm font-medium leading-normal">
                      {filter} {filter === "All" ? `(${listings.length})` : ""}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Property Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>

            {filteredProperties.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No properties found</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
