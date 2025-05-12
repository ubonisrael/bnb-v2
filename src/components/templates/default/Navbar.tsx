"use client"

import React, { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Sun, Moon, Menu } from "lucide-react";

const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { name, logo } = useApp();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  return (
    <nav className="bg-white shadow-sm dark:bg-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <img 
                className="block h-8 w-auto" 
                src={BUSINESS_INFO.logo} 
                alt={`${BUSINESS_INFO.name} Logo`} 
              />
              <span className="ml-2 text-xl font-bold text-primary-600 dark:text-primary-500">
                {BUSINESS_INFO.name}
              </span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <a 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  setActiveStep("home");
                }}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  activeStep === "home" 
                    ? "border-primary-500 text-gray-900 dark:text-white" 
                    : "border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 dark:hover:text-white"
                }`}
              >
                Home
              </a>
              <a 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  setActiveStep("services");
                }}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  activeStep === "services" 
                    ? "border-primary-500 text-gray-900 dark:text-white" 
                    : "border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 dark:hover:text-white"
                }`}
              >
                Services
              </a>
              <a 
                href="#" 
                className="border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 dark:hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                About
              </a>
              <a 
                href="#" 
                className="border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 dark:hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Contact
              </a>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={toggleTheme}
              className="bg-gray-200 dark:bg-gray-700 rounded-full p-2 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <Button>Sign In</Button>
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
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                setActiveStep("home");
                setShowMobileMenu(false);
              }}
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                activeStep === "home"
                  ? "bg-primary-50 dark:bg-gray-700 border-primary-500 text-primary-700 dark:text-white"
                  : "border-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
            >
              Home
            </a>
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                setActiveStep("services");
                setShowMobileMenu(false);
              }}
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                activeStep === "services"
                  ? "bg-primary-50 dark:bg-gray-700 border-primary-500 text-primary-700 dark:text-white"
                  : "border-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
            >
              Services
            </a>
            <a 
              href="#" 
              className="border-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            >
              About
            </a>
            <a 
              href="#" 
              className="border-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            >
              Contact
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
