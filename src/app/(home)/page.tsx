"use client";
import { redirect } from "next/navigation"
import { useEffect } from "react";
import Header from "./Header";
import Hero from "./Hero";
import Features from "./Features";
import Templates from "./Templates";
import Demo from "./Demo";
import CallToAction from "./CallToAction";
import Footer from "./Footer";

export default function Home() {

  useEffect(() => {
    // Apply animations on scroll
    const animateOnScroll = () => {
      const elements = document.querySelectorAll('.animate-fade-up, .feature-card');

      elements.forEach((element) => {
        const elementPosition = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        if (elementPosition < windowHeight * 0.9) {
          element.classList.add('opacity-100');
        }
      });
    };

    window.addEventListener('scroll', animateOnScroll);
    // Trigger once on load
    setTimeout(animateOnScroll, 100);

    return () => {
      window.removeEventListener('scroll', animateOnScroll);
    };
  }, []);


  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Hero />
        <Features />
        <Templates />
        <Demo />
        <CallToAction />
      </main>
      <Footer />
    </div>
  )
}

