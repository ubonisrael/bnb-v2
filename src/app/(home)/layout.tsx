import React from "react";
import Footer from "@/app/(home)/Footer";
import Header from "@/app/(home)/Header";

export default function LandingPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
   <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}
