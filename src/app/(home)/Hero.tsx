"use client";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Hero = () => {
  return (
    <section className="pt-32 pb-20 md:pt-40 md:pb-32 hero-gradient relative overflow-hidden">
      <div className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center stagger-animation">
          <div className="inline-block mb-4 px-3 py-1 rounded-full bg-brand-100 text-brand-700 text-sm font-medium animate-fade-in">
            Effortless Booking Management
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight leading-tight">
            Personalized Booking<br />Experience for <span className="text-brand-500">Everyone</span>
          </h1>

          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Create custom booking processes that perfectly match your brand and customer needs. Simple, flexible, and designed just for you.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button className="w-full sm:w-auto text-md px-8 py-6 bg-brand-500 hover:bg-brand-600 text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-all">
              <Link href="/auth/register" className="flex items-center">
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" className="w-full sm:w-auto text-md px-8 py-6 border-brand-200 text-brand-700 hover:bg-brand-50 rounded-lg">
              <Link href="/demo">View Demo</Link>
            </Button>
          </div>
        </div>

        <div className="mt-16 max-w-5xl mx-auto rounded-xl overflow-hidden shadow-soft animate-fade-up opacity-0" style={{ animationDelay: "0.4s" }}>
          <div className="relative bg-gradient-to-b from-brand-50 to-white p-6 rounded-t-xl border border-brand-100">
            <div className="absolute top-6 left-6 flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
            <div className="pt-8">
              <div className="max-w-4xl mx-auto glass-panel p-6 flex flex-col items-center">
                <h3 className="text-2xl font-medium text-brand-700 mb-4">Create Your Perfect Booking Flow</h3>
                <div className="grid md:grid-cols-3 gap-4 w-full mt-2">
                  <div className="bg-white shadow-sm rounded-lg p-4 border border-brand-100 flex flex-col items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-brand-100 flex items-center justify-center mb-3">
                      <span className="text-xl font-bold text-brand-700">1</span>
                    </div>
                    <p className="text-sm text-center">Choose your template</p>
                  </div>
                  <div className="bg-white shadow-sm rounded-lg p-4 border border-brand-100 flex flex-col items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-brand-100 flex items-center justify-center mb-3">
                      <span className="text-xl font-bold text-brand-700">2</span>
                    </div>
                    <p className="text-sm text-center">Customize your process</p>
                  </div>
                  <div className="bg-white shadow-sm rounded-lg p-4 border border-brand-100 flex flex-col items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-brand-100 flex items-center justify-center mb-3">
                      <span className="text-xl font-bold text-brand-700">3</span>
                    </div>
                    <p className="text-sm text-center">Start accepting bookings</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
