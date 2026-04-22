import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import AllHeader from "../../Header/Header";

const PRIMARY = "#1f1fe0";

const mainNav = [
  { icon: "home", label: "Home", to: "/" },
  { icon: "search", label: "Browse PGs", to: "/" },
  { icon: "favorite", label: "Saved", to: "/account/saved" },
];

const accountNav = [
  { icon: "calendar_month", label: "Bookings", to: "/account/bookings" },
  { icon: "door_front", label: "My Rooms", to: "/account/rooms" },
  { icon: "person", label: "Profile", to: "/account/profile" },
];

const mobileNav = [
  { icon: "home", label: "Home", to: "/" },
  { icon: "search", label: "Search", to: "/" },
  { icon: "favorite", label: "Saved", to: "/account/saved" },
  { icon: "person", label: "Profile", to: "/account/profile" },
];
function SidebarLink({ icon, label, to }) {
  const { pathname } = useLocation(); // 👈 import useLocation from react-router-dom
  console.log("pathname: ", pathname);

  const isIndexActive = to === "/account/rooms" && pathname === "/account";

  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-2 px-3 py-2.5 rounded-xl shrink-0 transition-all text-sm font-semibold ${
          isActive || isIndexActive
            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
            : "text-slate-600 hover:bg-white"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <span
            className="material-symbols-outlined text-xl"
            style={
              isActive || isIndexActive
                ? { fontVariationSettings: "'FILL' 1" }
                : {}
            }
          >
            {icon}
          </span>
          <span className="hidden md:inline">{label}</span>
        </>
      )}
    </NavLink>
  );
}
export default function Account() {
  return (
    <div className="relative flex min-h-screen flex-col bg-slate-100">
      {/* Header */}

      <AllHeader />

      {/* Main */}
      <main className="flex flex-1 flex-col md:flex-row gap-4 px-3 md:px-8 py-5 max-w-7xl mx-auto w-full">
        {/* Sidebar */}
        <aside className="w-full md:w-56 shrink-0">
          <nav className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
            {mainNav.map(({ icon, label, to }) => (
              <SidebarLink key={label} icon={icon} label={label} to={to} />
            ))}

            {/* Divider — desktop only */}
            <div className="hidden md:flex items-center gap-2 px-3 mt-4 mb-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Account
              </span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            {accountNav.map(({ icon, label, to }) => (
              <SidebarLink key={label} icon={icon} label={label} to={to} />
            ))}
          </nav>
        </aside>

        {/* Child routes render here */}
        <Outlet />
      </main>

      {/* Bottom Nav - Mobile */}
      {/* <nav className="md:hidden sticky bottom-0 z-50 bg-white/90 backdrop-blur-xl border-t border-slate-200 px-4 py-2 flex justify-around items-center">
        {mobileNav.map(({ icon, label, to }) => (
          <NavLink key={label} to={to} end>
            {({ isActive }) => (
              <div
                className={`flex flex-col items-center gap-0.5 ${
                  isActive ? "text-indigo-600" : "text-slate-400"
                }`}
              >
                <span
                  className="material-symbols-outlined text-2xl"
                  style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
                >
                  {icon}
                </span>
                <span className="text-[9px] font-bold uppercase">{label}</span>
              </div>
            )}
          </NavLink>
        ))}
      </nav> */}
    </div>
  );
}
