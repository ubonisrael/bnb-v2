"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const CallToAction = () => {
  return (
    <section id="get-started" className="py-20 bg-brand-500">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center opacity-0 animate-fade-up" style={{ animationDelay: "0.1s" }}>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Ready to Transform Your Booking Experience?</h2>
          <p className="text-lg text-white/90 mb-10 max-w-2xl mx-auto">
            Join thousands of businesses that are streamlining their booking process and delighting their customers.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button className="bg-white text-brand-600 hover:bg-brand-50 text-md px-8 py-6 font-medium rounded-lg shadow-sm hover:shadow-md transition-all">
              <a href="#" className="flex items-center">
                Get Started For Free <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
            <Button variant="outline" className="text-md px-8 py-6 border-white/30 text-black hover:bg-brand-600 hover:border-white/50 rounded-lg">
              <a href="#">Contact Sales</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
