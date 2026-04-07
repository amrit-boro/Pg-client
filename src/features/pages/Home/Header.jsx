import { Link } from "react-router-dom";

function Header() {
  // const { data: user, isLoggedIn, error } = useGetUser();
  const isLoggedIn = true;
  const user = {
    data: {
      profilePictureUrl: "http://imga1.jpg",
      fullName: "Amrit",
    },
  };
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 backdrop-blur-sm bg-opacity-95">
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-10 py-1.5 md:py-2">
        <div className="flex items-center justify-between">
          {/* Logo + Title */}
          <div className="flex items-center gap-1.5 md:gap-2">
            <svg
              className="w-4 h-4 md:w-4.5 md:h-4.5 text-blue-500"
              fill="none"
              viewBox="0 0 48 48"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M24 4C25.7818 14.2173 33.7827 22.2182 44 24C33.7827 25.7818 25.7818 33.7827 24 44C22.2182 33.7827 14.2173 25.7818 4 24C14.2173 22.2182 22.2182 14.2173 24 4Z"
                fill="currentColor"
              ></path>
            </svg>
            <h2 className="text-gray-900 text-sm md:text-sm font-bold">
              PG-Finder
            </h2>
          </div>

          {/* Navigation */}
          <nav className="hidden sm:flex gap-3 md:gap-4">
            <a
              href="#"
              className="text-gray-600 hover:text-blue-500 text-xs md:text-sm font-medium transition-colors"
            >
              Find a PG
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-blue-500 text-xs md:text-sm font-medium transition-colors"
            >
              List Your Property
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-blue-500 text-xs md:text-sm font-medium transition-colors"
            >
              About Us
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-blue-500 text-xs md:text-sm font-medium transition-colors"
            >
              Contact
            </a>
          </nav>

          {/* Buttons */}
          <div className="flex items-center gap-1 md:gap-1.5">
            {isLoggedIn ? (
              <>
                <Link
                  to="/landlord"
                  className="w-9 h-9 md:w-10 md:h-10 rounded-full overflow-hidden border-2 border-green-600 hover:border-green-700 transition-all flex items-center justify-center"
                >
                  <img
                    src={user?.data?.profilePictureUrl}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </Link>
                <p className="text-gray-800 text-lg md:text-xl font-semibold">
                  {user?.data?.fullName}
                </p>
              </>
            ) : (
              <Link
                to="/landlordCrud"
                className="px-2.5 h-7 md:h-8 rounded-md bg-blue-600 text-white text-xs font-semibold 
            hover:bg-green-700 transition-colors flex items-center justify-center"
              >
                Offer a Place
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
