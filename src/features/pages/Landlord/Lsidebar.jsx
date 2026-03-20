import { useQuery } from "@tanstack/react-query";
import { getUser } from "../../../services/userApi";
import { useUser } from "../../../hooks/useLogin";
import { useGetUser } from "../../../hooks/useUser";
import { Link, NavLink } from "react-router-dom";

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
function Lsidebar() {
  const { data: user, isLoggedIn } = useGetUser();
  console.log(user);

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-gray-200 bg-white sticky top-0">
      <div className="flex h-full flex-col justify-between p-4">
        <div className="flex flex-col gap-4">
          {/* Profile */}
          <div className="flex items-center gap-3 p-2">
            <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10 h-10">
              <img src={user?.data?.profilePictureUrl} />
            </div>
            <div className="flex flex-col">
              <h1 className="text-gray-900 text-base font-medium leading-normal">
                {user?.data?.fullName}
              </h1>
              <p className="text-gray-500 text-sm font-normal leading-normal">
                Landlord
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-2">
            <a
              className="flex items-center gap-3 px-3 py-2 rounded-lg bg-blue-50"
              href="#"
            >
              <Icon name="apartment" className="text-blue-600" />
              <p className="text-blue-600 text-sm font-bold leading-normal">
                My Listings
              </p>
            </a>
            <a
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100"
              href="#"
            >
              <Icon name="task_alt" className="text-gray-700" />
              <p className="text-gray-700 text-sm font-medium leading-normal">
                Booking Requests
              </p>
            </a>
            <a
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100"
              href="#"
            >
              <Icon name="settings" className="text-gray-700" />
              <p className="text-gray-700 text-sm font-medium leading-normal">
                Settings
              </p>
            </a>
          </nav>
        </div>

        <div className="flex flex-col gap-4">
          <NavLink
            to="/landlordCrud"
            className="flex min-w-[84px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-blue-600 text-white text-sm font-bold leading-normal hover:bg-blue-700 transition-colors"
          >
            <p className="truncate">Add New Listing</p>
          </NavLink>
          <a
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100"
            href="#"
          >
            <Icon name="help_outline" className="text-gray-700 text-base" />
            <p className="text-gray-700 text-sm font-medium leading-normal">
              Help Center
            </p>
          </a>
        </div>
      </div>
    </aside>
  );
}

export default Lsidebar;
