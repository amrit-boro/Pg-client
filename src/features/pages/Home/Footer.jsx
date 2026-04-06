import {
  Search,
  Home,
  Eye,
  Briefcase,
  Facebook,
  Twitter,
  Github,
} from "lucide-react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-12 px-6 md:px-10 lg:px-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-3">
              <svg
                className="w-7 h-7 text-blue-500"
                fill="none"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M24 4C25.7818 14.2173 33.7827 22.2182 44 24C33.7827 25.7818 25.7818 33.7827 24 44C22.2182 33.7827 14.2173 25.7818 4 24C14.2173 22.2182 22.2182 14.2173 24 4Z"
                  fill="currentColor"
                ></path>
              </svg>
              <h2 className="text-gray-900 text-2xl font-bold">PG-Finder</h2>
            </div>
            <p className="mt-4 text-gray-500 text-sm">
              Your one-stop solution for finding and booking the best PGs and
              rooms.
            </p>
          </div>

          <div>
            <h3 className="text-gray-800 font-bold tracking-wider uppercase text-sm">
              Company
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link className="text-gray-500 hover:text-blue-500 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link className="text-gray-500 hover:text-blue-500 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link className="text-gray-500 hover:text-blue-500 transition-colors">
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-gray-800 font-bold tracking-wider uppercase text-sm">
              Support
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link className="text-gray-500 hover:text-blue-500 transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link className="text-gray-500 hover:text-blue-500 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link className="text-gray-500 hover:text-blue-500 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-gray-800 font-bold tracking-wider uppercase text-sm">
              Connect
            </h3>
            <div className="mt-4 flex space-x-4">
              <Link
                href="#"
                className="text-gray-400 hover:text-blue-500 transition-colors"
              >
                <Facebook className="h-6 w-6" />
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-blue-500 transition-colors"
              >
                <Twitter className="h-6 w-6" />
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-blue-500 transition-colors"
              >
                <Github className="h-6 w-6" />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-8 text-center text-sm text-gray-500">
          <p>© 2024 PG-Finder. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
