"use client";
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useRouter } from 'next/navigation';

const Header = () => {
  const navigate = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
        ? 'py-3 bg-white/90 backdrop-blur-md shadow-sm'
        : 'py-5 bg-transparent'
        }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center">
          <a href="/" className="flex items-center space-x-2">
            <span className="text-xl md:text-2xl font-serif font-semibold text-brand-700">Bank n' Book</span>
          </a>
        </div>

        <nav className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-sm font-medium text-foreground hover:text-brand-600 transition-colors">Features</a>
          <a href="#templates" className="text-sm font-medium text-foreground hover:text-brand-600 transition-colors">Templates</a>
          <a href="#demo" className="text-sm font-medium text-foreground hover:text-brand-600 transition-colors">Demo</a>

          <Button asChild className="bg-brand-500 cursor-pointer hover:bg-brand-600 text-white" onClick={() => navigate.push('/auth/register')}>
            <a>Get Started</a>
          </Button>
        </nav>

        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-white z-40 pt-20 px-4 animate-fade-in md:hidden">
          <nav className="flex flex-col space-y-6 items-center">
            <a
              href="#features"
              className="text-lg font-medium w-full text-center py-3 border-b border-border"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Features
            </a>
            <a
              href="#templates"
              className="text-lg font-medium w-full text-center py-3 border-b border-border"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Templates
            </a>
            <a
              href="#demo"
              className="text-lg font-medium w-full text-center py-3 border-b border-border"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Demo
            </a>
            <a
              href="#pricing"
              className="text-lg font-medium w-full text-center py-3 border-b border-border"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Pricing
            </a>
            <Button
              className="w-full bg-brand-500 hover:bg-brand-600 text-white mt-4"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <a href="#get-started">Get Started</a>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
