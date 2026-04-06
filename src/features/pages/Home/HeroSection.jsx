import { useState } from "react";
import { Search, Home, Eye, Briefcase } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

function HeroSection() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const propertyType = searchParams.get("type") || "";

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set("type", value); // ?type=Girls%PG
      return params;
    });
  };

  return (
    <>
      <section
        className="relative min-h-[520px] flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(rgba(15,23,42,0.65), rgba(15,23,42,0.75)), url(https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1600&h=900&fit=crop)",
        }}
      >
        <div className="w-full max-w-4xl px-6 text-center">
          {/* Heading */}
          <h1 className="text-white text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4">
            Find Your Perfect Stay
          </h1>

          <p className="text-slate-200 text-base sm:text-lg mb-10 max-w-2xl mx-auto">
            Browse verified PGs and rental spaces tailored to your budget and
            lifestyle.
          </p>

          {/* Search Card */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const params = new URLSearchParams();
              if (propertyType) {
                params.set("type", propertyType);
              }
              navigate(`/listings?${params.toString()}`);
            }}
            className="bg-white/90 backdrop-blur-lg shadow-2xl rounded-2xl p-4 sm:p-5"
          >
            <div className="flex flex-col sm:flex-row gap-3 items-stretch">
              {/* Select */}
              <div className="flex items-center flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 focus-within:ring-2 focus-within:ring-blue-500 transition">
                <Home className="text-slate-500 w-5 h-5 mr-2" />
                <select
                  className="w-full bg-transparent py-3 text-sm font-medium text-slate-700 focus:outline-none"
                  value={propertyType}
                  onChange={handleChange}
                >
                  <option value="">Select property type</option>
                  <option value="girls_pg">Girls PG</option>
                  <option value="boys_pg">Boys PG</option>
                  <option value="rent">Rent</option>
                </select>
              </div>

              {/* Button */}
              <button
                type="submit"
                disabled={!propertyType}
                className={`sm:w-auto w-full px-6 py-3 cursor-pointer rounded-xl font-semibold text-sm shadow-md transition-all duration-200
                ${
                  !propertyType
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg"
                }`}
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}

export default HeroSection;
