import React, { useState, useRef, useEffect } from "react";
import {
  MessageSquare,
  Settings,
  User,
  Menu,
  Plus,
  ArrowUp,
  Image as ImageIcon,
  Check,
  Sparkles,
  Home,
  MapPin,
  Users,
} from "lucide-react";

const DescriptionGenerator = () => {
  const [loading, setLoading] = useState(false);
  const [generatedDescription, setGeneratedDescription] = useState("");

  // State for the form inputs
  const [formData, setFormData] = useState({
    propertyType: "Shared Room",
    location: "Koramangala, Bangalore",
    gender: "Students & Professionals",
    amenities: [],
  });

  // Additional instructions from the text area
  const [customInstructions, setCustomInstructions] = useState("");

  const amenityOptions = [
    "High-Speed WiFi",
    "AC",
    "3 Times Meals",
    "Power Backup",
    "Daily Housekeeping",
    "Attached Washroom",
    "Washing Machine",
    "Geyser",
  ];

  const handleAmenityToggle = (amenity) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const generateDescription = async (e) => {
    e?.preventDefault(); // Prevent form submit refresh

    if (formData.amenities.length === 0) {
      alert("Please select at least one amenity!");
      return;
    }

    setLoading(true);
    setGeneratedDescription(""); // Clear previous result

    try {
      // UPDATE: Add customInstructions to the payload
      const payload = {
        ...formData,
        customInstructions: customInstructions,
      };

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/v1/ai/generate-description`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      const data = await response.json();
      if (data.description) {
        setGeneratedDescription(data.description);
      }
    } catch (error) {
      console.error("Error generating description:", error);
      alert("Failed to generate description");
    } finally {
      setLoading(false);
    }
  };

  // Custom Colors from your design
  const colors = {
    primary: "#135bec",
    bgLight: "#f6f6f8",
    bgDark: "#101622",
    textDarkSecondary: "#92a4c9",
  };

  return (
    <div className="flex h-screen w-full flex-row overflow-hidden bg-[#f6f6f8] dark:bg-[#101622] font-sans text-gray-800 dark:text-gray-200 transition-colors duration-300">
      {/* --- SIDEBAR --- */}
      <aside className="hidden md:flex h-full w-64 flex-col justify-between border-r border-gray-200/10 bg-[#f6f6f8] p-4 dark:bg-[#101622]/50">
        <div className="flex flex-col gap-4">
          {/* Logo Area */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg">
              <Sparkles size={20} />
            </div>
            <div className="flex flex-col">
              <h1 className="text-gray-900 dark:text-white text-base font-medium leading-normal">
                AI Copywriter
              </h1>
              <p className="text-gray-500 dark:text-[#92a4c9] text-sm font-normal leading-normal">
                PG Finder Assistant
              </p>
            </div>
          </div>

          {/* Nav Links */}
          <div className="flex flex-col gap-1">
            <button className="flex items-center gap-3 rounded-lg bg-[#135bec]/10 px-3 py-2 text-[#135bec] dark:bg-[#135bec]/20 dark:text-blue-400">
              <MessageSquare size={20} className="font-semibold" />
              <p className="text-sm font-bold leading-normal">
                New Property Listing
              </p>
            </button>
            <button className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5 transition-colors">
              <MessageSquare size={20} />
              <p className="text-sm font-medium leading-normal">
                Saved Descriptions
              </p>
            </button>
          </div>
        </div>

        {/* Bottom Sidebar */}
        <div className="flex flex-col gap-4">
          <button
            onClick={() => setGeneratedDescription("")}
            className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#135bec] text-white text-sm font-bold leading-normal tracking-wide hover:bg-blue-700 transition-colors"
          >
            <span className="truncate flex items-center gap-2">
              <Plus size={16} /> New Chat
            </span>
          </button>
          <div className="flex flex-col gap-1">
            <button className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5">
              <Settings size={20} />
              <p className="text-sm font-medium leading-normal">Settings</p>
            </button>
            <button className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5">
              <User size={20} />
              <p className="text-sm font-medium leading-normal">Account</p>
            </button>
          </div>
        </div>
      </aside>

      {/* --- MAIN AREA --- */}
      <main className="flex h-full flex-1 flex-col relative">
        {/* Top Nav */}
        <header className="flex w-full items-center justify-between whitespace-nowrap border-b border-solid border-gray-200/10 px-6 py-3 bg-[#f6f6f8] dark:bg-[#101622] z-10">
          <div className="flex items-center gap-4">
            <h2 className="text-gray-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">
              Generator
            </h2>
          </div>
          <button className="md:hidden flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 w-10 bg-transparent text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5">
            <Menu size={24} />
          </button>
        </header>

        {/* Chat Content Area */}
        <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
          <div className="mx-auto flex max-w-4xl flex-col gap-8 pb-32">
            {/* Welcome / Config Section */}
            {!generatedDescription && (
              <div className="flex flex-col items-center justify-center gap-6 py-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-gray-900 dark:text-white tracking-tight text-center text-3xl font-bold leading-tight">
                  Let's write a great description.
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-center text-base font-normal leading-normal max-w-lg">
                  Tell me about your property details below, and I'll generate
                  an SEO-friendly listing for you in seconds.
                </p>

                {/* Configuration Cards Grid */}
                <div className="grid w-full grid-cols-1 gap-4 pt-4 md:grid-cols-2">
                  {/* Card 1: Location & Type */}
                  <div className="flex flex-col gap-3 rounded-xl border border-gray-200/10 bg-white/50 p-6 shadow-sm transition-colors hover:bg-white dark:bg-white/5 dark:hover:bg-white/10">
                    <div className="flex items-center gap-2 text-[#135bec] font-bold mb-2">
                      <MapPin size={18} /> Property Details
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase mb-1 block">
                          Location
                        </label>
                        <input
                          type="text"
                          value={formData.location}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              location: e.target.value,
                            })
                          }
                          className="w-full bg-transparent border-b border-gray-300 dark:border-gray-700 py-1 text-gray-900 dark:text-white focus:outline-none focus:border-[#135bec] transition-colors"
                          placeholder="e.g. Indiranagar"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase mb-1 block">
                          Type
                        </label>
                        <select
                          value={formData.propertyType}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              propertyType: e.target.value,
                            })
                          }
                          className="w-full bg-transparent border-b border-gray-300 dark:border-gray-700 py-1 text-gray-900 dark:text-white focus:outline-none focus:border-[#135bec] [&>option]:text-black"
                        >
                          <option>Shared Room</option>
                          <option>Private Room</option>
                          <option>Full Flat (1BHK)</option>
                          <option>Full Flat (2BHK)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Tenant Preference */}
                  <div className="flex flex-col gap-3 rounded-xl border border-gray-200/10 bg-white/50 p-6 shadow-sm transition-colors hover:bg-white dark:bg-white/5 dark:hover:bg-white/10">
                    <div className="flex items-center gap-2 text-[#135bec] font-bold mb-2">
                      <Users size={18} /> Target Tenant
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {[
                        "Students",
                        "Professionals",
                        "Boys",
                        "Girls",
                        "Anyone",
                      ].map((opt) => (
                        <button
                          key={opt}
                          onClick={() =>
                            setFormData({ ...formData, gender: opt })
                          }
                          className={`px-3 py-1.5 text-sm rounded-full border transition-all ${
                            formData.gender === opt
                              ? "bg-[#135bec] text-white border-[#135bec]"
                              : "border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5"
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Card 3: Amenities (Full Width) */}
                  <div className="col-span-1 md:col-span-2 flex flex-col gap-3 rounded-xl border border-gray-200/10 bg-white/50 p-6 shadow-sm transition-colors hover:bg-white dark:bg-white/5 dark:hover:bg-white/10">
                    <div className="flex items-center gap-2 text-[#135bec] font-bold mb-2">
                      <Sparkles size={18} /> Amenities Included
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {amenityOptions.map((item) => (
                        <button
                          key={item}
                          onClick={() => handleAmenityToggle(item)}
                          className={`flex items-center gap-2 text-xs sm:text-sm px-3 py-2.5 rounded-lg border transition-all text-left ${
                            formData.amenities.includes(item)
                              ? "bg-[#135bec]/10 border-[#135bec] text-[#135bec] dark:text-blue-400 font-semibold"
                              : "bg-transparent border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5"
                          }`}
                        >
                          {formData.amenities.includes(item) && (
                            <Check size={14} />
                          )}
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Generated Result Section */}
            {generatedDescription && (
              <div className="flex flex-col gap-4 animate-in slide-in-from-bottom-10 duration-500">
                {/* User Message */}
                <div className="flex justify-end">
                  <div className="bg-[#135bec] text-white px-5 py-3 rounded-2xl rounded-br-none max-w-[80%] shadow-md">
                    Generate a description for a {formData.propertyType} in{" "}
                    {formData.location}.
                  </div>
                </div>

                {/* AI Response */}
                <div className="flex gap-4 justify-start w-full mt-4">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white shadow-md">
                    <Sparkles size={20} />
                  </div>
                  <div className="flex flex-col gap-2 max-w-[90%]">
                    <div className="text-sm font-bold text-gray-500 dark:text-[#92a4c9] ml-1">
                      AI Assistant
                    </div>
                    <div className="bg-white dark:bg-white/5 border border-gray-200/50 dark:border-gray-700 p-6 rounded-2xl rounded-tl-none shadow-sm text-gray-800 dark:text-gray-100 leading-relaxed whitespace-pre-wrap">
                      {generatedDescription}
                    </div>
                    <div className="flex gap-2 mt-2 pl-1">
                      <button
                        onClick={() =>
                          navigator.clipboard.writeText(generatedDescription)
                        }
                        className="text-xs flex items-center gap-1 text-gray-500 hover:text-[#135bec] transition-colors"
                      >
                        Copy Text
                      </button>
                      <button
                        onClick={() => setGeneratedDescription("")}
                        className="text-xs flex items-center gap-1 text-gray-500 hover:text-[#135bec] transition-colors"
                      >
                        Regenerate
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="flex gap-4 justify-start w-full mt-4 opacity-70">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 dark:bg-white/10 animate-pulse"></div>
                <div className="space-y-2 w-1/2">
                  <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-3/4 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-full animate-pulse"></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* --- BOTTOM INPUT AREA --- */}
        <div className="w-full border-t border-gray-200/10 bg-[#f6f6f8] p-4 dark:bg-[#101622] z-20">
          <div className="mx-auto max-w-4xl">
            <form
              onSubmit={generateDescription}
              className="relative flex items-end gap-2 bg-white/50 dark:bg-white/5 border border-gray-200/50 dark:border-gray-700 rounded-xl p-2 shadow-sm focus-within:ring-2 focus-within:ring-[#135bec]/50 transition-all"
            >
              <button
                type="button"
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                <ImageIcon size={20} />
              </button>

              <textarea
                value={customInstructions}
                onChange={(e) => setCustomInstructions(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    generateDescription(e);
                  }
                }}
                className="w-full bg-transparent border-none focus:ring-0 resize-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 py-3 max-h-32"
                placeholder="Add custom instructions (e.g. 'Make it sound luxurious')..."
                rows={1}
              />

              <button
                type="submit"
                disabled={loading}
                className={`flex items-center justify-center rounded-lg p-2.5 transition-all duration-200 ${
                  loading
                    ? "bg-gray-300 dark:bg-gray-700 cursor-not-allowed"
                    : "bg-[#135bec] hover:bg-blue-700 text-white shadow-md hover:shadow-lg"
                }`}
              >
                <ArrowUp size={20} className={loading ? "animate-spin" : ""} />
              </button>
            </form>
            <div className="text-center mt-2">
              <p className="text-[10px] text-gray-400">
                AI can make mistakes. Review generated text before publishing.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DescriptionGenerator;
