import { ModeToggle } from "@/components/mode-toogle";
import { Navbar } from "@/components/navbar";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {/* ================ Navbar Section ================ */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-sm supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <Link href="/" className="flex items-center gap-1 text-xl font-bold text-brand-blue">
            <Image
              src="/images/byte-logo-raw-nobg.png"
              width={48}
              height={48}
              alt="BYTE Logo"
              className="h-12 w-12"
            />
            BYTE
          </Link>

          <div className="flex items-center gap-4">
            <Navbar />
            <ModeToggle />
          </div>
        </div>
      </header>
      {children}
    </>
  );
};

export default Layout;
