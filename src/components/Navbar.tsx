"use client";

import React from "react";

const Navbar: React.FC = () => {
  // const { theme, toggleTheme } = useTheme();

  return (
    <nav className="bg-white shadow-sm dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex  items-center justify-between h-16">
          <div className="flex">
            <h1>BNB</h1>
          </div>
          <div className="flex items-center space-x-4">
            {/* <button
              onClick={toggleTheme}
              className="bg-gray-200 dark:bg-gray-700 rounded-full p-2 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button> */}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
