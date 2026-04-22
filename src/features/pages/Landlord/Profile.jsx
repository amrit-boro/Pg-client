import { useState } from "react";
import { useUserProfile } from "../../../hooks/useProfile";

// ── Fake Data ────────────────────────────────────────────────────────────────
const fakeUser = {
  name: "Arjun Sharma",
  email: "arjun.sharma@gmail.com",
  phone: "+91 98765 43210",
  avatar: "https://i.pravatar.cc/150?img=12",
  joined: "January 2024",
  role: "Property Owner",
  address: "Guwahati, Assam, India",
  // ✅ New Location Data
  location: {
    city: "Guwahati",
    state: "Assam",
    country: "India",
    pincode: "781001",
    coordinates: {
      lat: 26.1445,
      lng: 91.7362,
    },
    landmark: "Near GS Road",
    timezone: "IST (UTC+5:30)",
    status: "Active",
  },
  bio: "Property owner managing multiple PG accommodations in Guwahati. Committed to providing clean, affordable, and comfortable stays for students and professionals.",
  stats: {
    rooms: 5,
    bookings: 23,
    rating: 4.8,
    reviews: 18,
  },
  verifications: {
    email: true,
    phone: true,
    aadhaar: false,
    pan: true,
  },
  recentActivity: [
    {
      icon: "door_front",
      text: "Added Room A-201",
      time: "2 days ago",
      color: "text-indigo-600",
    },
    {
      icon: "calendar_month",
      text: "New booking confirmed for Room A-111",
      time: "5 days ago",
      color: "text-green-600",
    },
    {
      icon: "edit",
      text: "Updated Room A-203 details",
      time: "1 week ago",
      color: "text-amber-600",
    },
    {
      icon: "star",
      text: "Received a 5★ review",
      time: "2 weeks ago",
      color: "text-yellow-500",
    },
  ],
};

// ── Sub-components ────────────────────────────────────────────────────────────

const formatDateTime = (isoString, options = {}) => {
  if (!isoString) return "";

  const date = new Date(isoString);

  const defaultOptions = {
    year: "numeric",
    month: "short", // Feb
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true, // change to false if you want 24h
  };

  return new Intl.DateTimeFormat(
    "en-IN", // change locale if needed
    { ...defaultOptions, ...options },
  ).format(date);
};

function StatCard({ icon, label, value, accent }) {
  return (
    <div className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm border border-slate-100">
      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center ${accent}`}
      >
        <span
          className="material-symbols-outlined text-xl"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          {icon}
        </span>
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-800 leading-none">
          {value}
        </p>
        <p className="text-xs text-slate-500 mt-0.5">{label}</p>
      </div>
    </div>
  );
}

function VerificationBadge({ label, verified }) {
  return (
    <div
      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium border ${
        verified
          ? "bg-green-50 border-green-200 text-green-700"
          : "bg-slate-50 border-slate-200 text-slate-400"
      }`}
    >
      <span
        className="material-symbols-outlined text-base"
        style={verified ? { fontVariationSettings: "'FILL' 1" } : {}}
      >
        {verified ? "verified" : "unpublished"}
      </span>
      {label}
    </div>
  );
}

function SectionCard({ title, icon, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-100">
        <span
          className="material-symbols-outlined text-indigo-600 text-xl"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          {icon}
        </span>
        <h2 className="font-semibold text-slate-700 text-sm">{title}</h2>
      </div>
      <div className="px-5 py-4">{children}</div>
    </div>
  );
}

// ── Field with edit toggle ────────────────────────────────────────────────────
function EditableField({ label, value, type = "text", onChange }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
      />
    </div>
  );
}

// ── Main Profile Component ────────────────────────────────────────────────────
export default function Profile() {
  const [user, setUser] = useState(fakeUser);
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  const { data, isLoading } = useUserProfile();

  console.log("userProfiledata: ", data);
  const handleSave = () => {
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const update = (field) => (val) => setUser((u) => ({ ...u, [field]: val }));

  return (
    <div className="flex-1 min-w-0 space-y-5">
      {/* ── Profile Hero Card ──────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Banner */}
        <div className="h-24 bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 relative">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <div className="px-5 pb-5">
          <div className="flex items-end justify-between -mt-10 mb-4">
            {/* Avatar */}
            <div className="relative">
              <img
                src={user.avatar}
                alt={data?.name}
                className="w-20 h-20 rounded-2xl border-4 border-white shadow-lg object-cover"
              />
              <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 border-2 border-white rounded-full" />
            </div>

            {/* Edit / Save buttons */}
            <div className="flex gap-2 mb-1">
              {saved && (
                <span className="flex items-center gap-1 text-xs text-green-600 font-semibold bg-green-50 px-3 py-1.5 rounded-xl border border-green-200 animate-pulse">
                  <span
                    className="material-symbols-outlined text-base"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    check_circle
                  </span>
                  Saved!
                </span>
              )}
              {editing ? (
                <>
                  <button
                    onClick={() => setEditing(false)}
                    className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all"
                  >
                    Save Changes
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-all"
                >
                  <span className="material-symbols-outlined text-base">
                    edit
                  </span>
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          {/* Name & meta */}
          {editing ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <EditableField
                label="Full Name"
                value={data?.name}
                onChange={update("name")}
              />
              <EditableField
                label="Address"
                value={user.address}
                onChange={update("address")}
              />
              <EditableField
                label="Bio"
                value={data?.bio}
                onChange={update("bio")}
              />
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-xl font-bold text-slate-800">
                  {data?.name}
                </h1>
                {/* <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                  {user.role}
                </span> */}
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500 mb-3">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-base">
                    location_on
                  </span>
                  {[data?.address_line1, data?.address_line2]
                    .filter(Boolean)
                    .join(", ")}
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-base">
                    calendar_today
                  </span>
                  Member since {formatDateTime(data?.created_at)}
                </span>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed max-w-xl">
                {data?.bio}
              </p>
            </>
          )}
        </div>
      </div>

      {/* ── Stats Row ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          icon="door_front"
          label="Total Rooms"
          value={user.stats.rooms}
          accent="bg-indigo-50 text-indigo-600"
        />
        <StatCard
          icon="calendar_month"
          label="Bookings"
          value={user.stats.bookings}
          accent="bg-violet-50 text-violet-600"
        />
        <StatCard
          icon="star"
          label="Avg. Rating"
          value={`${data?.avg_rating}★`}
          accent="bg-amber-50 text-amber-500"
        />
        <StatCard
          icon="rate_review"
          label="Reviews"
          value={data?.review_count}
          accent="bg-green-50 text-green-600"
        />
      </div>

      {/* ── Lower Two-Column Grid ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Contact Info */}
        <SectionCard title="Contact Information" icon="contact_page">
          {editing ? (
            <div className="space-y-3">
              <EditableField
                label="Email"
                value={user.email}
                type="email"
                onChange={update("email")}
              />
              <EditableField
                label="Phone"
                value={user.phone}
                type="tel"
                onChange={update("phone")}
              />
            </div>
          ) : (
            <div className="space-y-3">
              {[
                { icon: "mail", label: "Email", value: data?.email },
                { icon: "phone", label: "Phone", value: data?.phone },
              ].map(({ icon, label, value }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-slate-500 text-base">
                      {icon}
                    </span>
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                      {label}
                    </p>
                    <p className="text-sm text-slate-700 font-medium">
                      {value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        {/* Verifications */}
        <SectionCard title="Verification Status" icon="verified_user">
          <div className="grid grid-cols-2 gap-2">
            <VerificationBadge
              label="Email"
              verified={user.verifications.email}
            />
            <VerificationBadge
              label="Phone"
              verified={user.verifications.phone}
            />
            <VerificationBadge
              label="Aadhaar"
              verified={user.verifications.aadhaar}
            />
            <VerificationBadge label="PAN" verified={user.verifications.pan} />
          </div>
          {!user.verifications.aadhaar && (
            <button className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-all">
              <span
                className="material-symbols-outlined text-base"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                warning
              </span>
              Verify Aadhaar to build trust
            </button>
          )}
        </SectionCard>

        {/* Location */}
        <SectionCard title="Location" icon="location_on">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-indigo-500">
                home_pin
              </span>
              <div>
                <p className="text-sm font-medium text-slate-700">
                  {user.location.landmark}
                </p>
                <p className="text-xs text-slate-500">
                  Primary residence / property location
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-slate-600">
              <span>Region</span>
              <span className="font-medium text-slate-700">
                {user.location.city}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm text-slate-600">
              <span>Country</span>
              <span className="font-medium text-slate-700">
                {user.location.country}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm text-slate-600">
              <span>Status</span>
              <span className="text-green-600 font-medium">
                Active Location
              </span>
            </div>
          </div>
        </SectionCard>

        {/* Recent Activity */}
        {/* <SectionCard title="Recent Activity" icon="history">
          <ul className="space-y-3">
            {user.recentActivity.map((item, i) => (
              <li key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                  <span
                    className={`material-symbols-outlined text-base ${item.color}`}
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    {item.icon}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-700 font-medium truncate">
                    {item.text}
                  </p>
                  <p className="text-xs text-slate-400">{item.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </SectionCard> */}

        {/* Danger Zone */}
        <SectionCard title="Account" icon="manage_accounts">
          <div className="space-y-2">
            {[
              {
                icon: "lock_reset",
                label: "Change Password",
                sub: "Update your login credentials",
                color:
                  "text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border-indigo-100",
              },
              {
                icon: "notifications",
                label: "Notification Settings",
                sub: "Manage alerts & reminders",
                color:
                  "text-slate-600 bg-slate-50 hover:bg-slate-100 border-slate-100",
              },
              {
                icon: "logout",
                label: "Sign Out",
                sub: "Log out of your account",
                color:
                  "text-rose-600 bg-rose-50 hover:bg-rose-100 border-rose-100",
              },
            ].map(({ icon, label, sub, color }) => (
              <button
                key={label}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition-all ${color}`}
              >
                <span
                  className="material-symbols-outlined text-xl"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  {icon}
                </span>
                <div>
                  <p className="text-sm font-semibold">{label}</p>
                  <p className="text-xs opacity-60">{sub}</p>
                </div>
                <span className="material-symbols-outlined text-base ml-auto opacity-40">
                  chevron_right
                </span>
              </button>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
