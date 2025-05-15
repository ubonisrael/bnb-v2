"use client";

import React, { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { useApp } from "@/contexts/AppContext";
import { Sun, Moon, Menu } from "lucide-react";
import Link from "next/link";
import AvatarImage from "./AvatarImage";

const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { name, logo, bUrl } = useApp();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  // console.log(logo)

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  return (
    <nav className="bg-white shadow-sm dark:bg-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <AvatarImage url={logo} name={name} />
              {name && (
              <span className="ml-2 text-xl font-bold text-primary-600 dark:text-primary-500">
                {name}
              </span>
              )}
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href={bUrl ? `/default/${bUrl}` : '#'}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 dark:hover:text-white`}
              >
                Home
              </Link>
              <Link
                href={bUrl ? `/default/${bUrl}/services`: '#'}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium
                    border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 dark:hover:text-white`}
              >
                Services
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="bg-gray-200 dark:bg-gray-700 rounded-full p-2 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
            <div className="sm:hidden">
              <button
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {showMobileMenu && (
        <div className="sm:hidden" id="mobile-menu">
          <div className="pt-2 pb-3 space-y-1">
            <Link
                href={`/default/${bUrl}`}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 dark:hover:text-white`}
              >
                Home
              </Link>
              <Link
                href={`/default/${bUrl}/services`}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium
                    border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 dark:hover:text-white`}
              >
                Services
              </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
