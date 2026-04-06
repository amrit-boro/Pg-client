import React, { useState } from "react";
import Gheader from "./Gheader";
import { Link } from "react-router-dom";

const bookingsData = [
  {
    id: "#PG12345",
    name: "Sunshine PG for Gents",
    checkIn: "25 Dec 2024",
    checkOut: "24 Jan 2025",
    status: "Upcoming",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAdAaMZFZD8fFUVVj568U0pZj8hRZBuGefL1yqVM7Zt9nxDoH0pR9fwEgNzh2LJBbc6tB6Uo4X6oTfNQg7uTibr1H4wt7eWNF80mjo1hjT1bz9X_IJw0XYDMLrOqjdg-iJtAd2yQRcnF0GSbV9zNSVw_CFxe1o7CuIfgK18naetIqEtkMLNhIz7kA5FDorosAi2JZc1_giwdxPWaptrWuPM0pv9zk4t_BlpwzvhvT6czZ80zd4UkATpHHLAnip7GiE1DfqBWkSbKqGu",
  },
  {
    id: "#PG67890",
    name: "Urban Nest Co-living",
    checkIn: "01 Nov 2024",
    checkOut: "30 Nov 2024",
    status: "Completed",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDALhmYFyWI60zrK8I1tB9-Vb5hVVgpN3LuHwpzUd8TZ61__V5AujLCo0bkha-5k7DO6YdLCfuqvaH2cz4zmMMKvTntu-0-kzXArr9YaWgPSSBos0YDV1WaJsw-3AojzIXQuXouquKS23bKqAbh2ENXKCg0zleyoTrSadIN_enKAIKAcYgBthlNozQdl2xAEdKqu5haORQMpxY9tS5FRA3fwpn98RulqJ0t-uqcPUJT0hsYHJkUyL78ymbpndcPtYqn1X3nsDjlW00p",
  },
  {
    id: "#PG54321",
    name: "Serene Stays for Women",
    checkIn: "15 Oct 2024",
    checkOut: "14 Nov 2024",
    status: "Cancelled",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDWY6I5Jce1yToMctb_lzNYGOK6VVQoDVqt_cXZX6EH1OM_MICF_ZxzMiqb9Iq3UrBNWYLZbjvvf80hPNMjn8xIdHXm0-IzxmnNa8hGjyQ4ZbT4boXA-fwjTWYgLp7YY1Q50-SANpK-XN1w21zJa6xvrjEtLRDdq3TkBChZrupNM696z1ya_0fbAGyEVBfrVvNF3ue1I4Ap48-HzOWOdXw4ic4YSF4kyqGZLWiGZINtqikHtPY979cg7RGjHmP8Fc_qUgGDu6XJtvSf",
  },
];

const Icon = ({ name, className = "" }) => (
  <span
    className={`material-symbols-outlined ${className}`}
    style={{
      fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24",
    }}
  >
    {name}
  </span>
);

const BookingCard = ({ booking }) => {
  const statusConfig = {
    Upcoming: "bg-yellow-100 text-yellow-800",
    Completed: "bg-green-100 text-green-800",
    Cancelled: "bg-red-100 text-red-800",
  };

  return (
    <div className="p-4">
      <div className="flex flex-col sm:flex-row items-stretch justify-between gap-6 rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
        <div
          className="w-full sm:w-52 h-40 sm:h-auto bg-center bg-no-repeat aspect-video sm:aspect-square bg-cover rounded-lg flex-shrink-0"
          style={{ backgroundImage: `url("${booking.image}")` }}
        />
        <div className="flex flex-1 flex-col gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <p className="text-slate-500 text-sm font-normal leading-normal">
                Booking ID: {booking.id}
              </p>
              <div
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  statusConfig[booking.status]
                }`}
              >
                {booking.status}
              </div>
            </div>
            <p className="text-slate-900 text-lg font-bold leading-tight">
              {booking.name}
            </p>
            <p className="text-slate-500 text-sm font-normal leading-normal">
              Check-in: {booking.checkIn} | Check-out: {booking.checkOut}
            </p>
          </div>
          <div className="flex items-center gap-4 mt-auto">
            {booking.status === "Upcoming" && (
              <>
                <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-4 bg-blue-600 text-white text-sm font-bold leading-normal w-fit hover:bg-blue-700">
                  View Details
                </button>
                <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-4 bg-slate-100 text-slate-800 text-sm font-medium leading-normal w-fit hover:bg-slate-200">
                  Contact Landlord
                </button>
              </>
            )}
            {booking.status === "Completed" && (
              <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-4 bg-slate-100 text-slate-800 text-sm font-medium leading-normal w-fit hover:bg-slate-200">
                View Invoice
              </button>
            )}
            {booking.status === "Cancelled" && (
              <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-4 bg-slate-100 text-slate-800 text-sm font-medium leading-normal w-fit hover:bg-slate-200">
                View Details
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function GuestaProfile() {
  const [activeFilter, setActiveFilter] = useState("All");

  const filters = ["All", "Upcoming", "Completed", "Cancelled"];

  const filteredBookings = bookingsData.filter((booking) => {
    if (activeFilter === "All") return true;
    return booking.status === activeFilter;
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined"
        rel="stylesheet"
      />

      <div className="relative flex min-h-screen w-full flex-col">
        {/* Top Navigation Bar */}
        <Gheader />
        {/* Main Content */}
        <div className="flex flex-1 justify-center px-4 sm:px-6 lg:px-10 py-8">
          <div className="flex flex-col md:flex-row max-w-7xl flex-1 gap-8">
            {/* Side Navigation Bar */}
            <aside className="w-full md:w-64 flex-shrink-0">
              <div className="flex min-h-[700px] flex-col justify-between bg-white p-4 rounded-xl shadow-sm">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-12 h-12"
                      style={{
                        backgroundImage:
                          'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCwr0clo92VChsj3JenFmUS0UwSSpMYxSxuiRChNIxMABusaAar8YbGael32KPz1HKW58QqTROEeuFUm1U2Nc57KrpvI6Ix45MXQ8NWoQXbCHAEwTCGWoEdtVUVH0yWCaluy_xZ4mLnqVk50aw-BWzOih5prU4P8OtaXUPUM1x5gRBLALPkOOy7SeLM7VAOw_krxp93vxfDkCoho_Xe9tKUfZ9OjpNP5hfOaqjlWECFbLNEh2W1KmL0p2ze5zRQWU9yCl5lhxCo-58Y")',
                      }}
                    />
                    <div className="flex flex-col">
                      <h1 className="text-base font-bold text-slate-900">
                        Rohan Sharma
                      </h1>
                      <p className="text-sm font-normal text-slate-500">
                        rohan.sharma@email.com
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 mt-4">
                    <Link
                      className="flex items-center gap-3 px-3 py-2 rounded-lg bg-blue-100 text-blue-600"
                      href="#"
                    >
                      <Icon name="calendar_month" className="text-2xl" />
                      <p className="text-sm font-bold leading-normal">
                        My Bookings
                      </p>
                    </Link>
                    <Link
                      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100"
                      href="#"
                    >
                      <Icon name="favorite" className="text-2xl" />
                      <p className="text-sm font-medium leading-normal">
                        Saved Listings
                      </p>
                    </Link>
                    <Link
                      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100"
                      href="#"
                    >
                      <Icon name="chat_bubble" className="text-2xl" />
                      <p className="text-sm font-medium leading-normal">
                        Messages
                      </p>
                    </Link>
                    <Link
                      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100"
                      href="#"
                    >
                      <Icon name="settings" className="text-2xl" />
                      <p className="text-sm font-medium leading-normal">
                        Profile Settings
                      </p>
                    </Link>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <Link
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-50 text-red-600"
                    href="#"
                  >
                    <Icon name="logout" className="text-2xl" />
                    <p className="text-sm font-medium leading-normal">Logout</p>
                  </Link>
                </div>
              </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1">
              {/* Page Heading */}
              <div className="flex flex-wrap justify-between gap-3 p-4">
                <h1 className="text-slate-900 text-4xl font-black leading-tight tracking-tight min-w-72">
                  My Bookings
                </h1>
              </div>

              {/* Filter Chips */}
              <div className="flex gap-3 p-3 overflow-x-auto">
                {filters.map((filter) => (
                  <div
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full cursor-pointer px-4 ${
                      activeFilter === filter
                        ? "bg-blue-600 text-white"
                        : "bg-white hover:bg-slate-200"
                    }`}
                  >
                    <p className="text-sm font-medium leading-normal">
                      {filter}
                    </p>
                  </div>
                ))}
              </div>

              {/* Booking Cards */}
              <div className="flex flex-col gap-6 mt-4">
                {filteredBookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
              </div>

              {filteredBookings.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-slate-500 text-lg">No bookings found</p>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
