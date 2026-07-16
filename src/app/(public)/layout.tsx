import React from "react";
import Footer from "./_components/Footer";
import Navbar from "./_components/Navbar";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 flex flex-col relative overflow-hidden bg-black text-[#F3EFE7] selection:bg-[#D4A855] selection:text-black">
      {/* Decorative ambient glowing background circles */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] aspect-square rounded-full bg-amber-900/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] aspect-square rounded-full bg-orange-900/10 blur-[120px] pointer-events-none" />

      {/* Navigation Header Component */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative z-10">
        {children}
      </main>

      {/* Footer Component */}
      <Footer />
    </div>
  );
}
