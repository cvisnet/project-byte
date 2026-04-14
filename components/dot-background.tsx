// components/GridBackgroundDemo.tsx
"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";

export function DotBackground() {

  // Avoid hydration mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <>
    <div
      className={cn(
        "fixed inset-0 -z-10 pointer-events-none opacity-5 dark:opacity-5",
        "bg-size-[20px_20px]",
        "bg-[radial-gradient(var(--brand-blue)_1px,transparent_2px)]",
        "dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_2px)",
        "bg-white dark:bg-black"
      )}
    />
    {/* <div className="pointer-events-none fixed inset-0 -z-10 flex items-center justify-center bg-white mask-[radial-gradient(ellipse_at_center,transparent_60%,black)] dark:bg-black" /> */}
    </>
  );
}
