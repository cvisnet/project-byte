"use client"

import { cn } from "@/lib/utils";
import { Canvas } from "@react-three/fiber";
import React from "react";
import Laptop from "./threejs/laptop";
import { OrbitControls } from "@react-three/drei";

type CanvasProps = {
  camera?: [number, number,]
}

export function GridBackground() {
  return (
    <div className="relative flex h-80 w-full items-center justify-center bg-background lg:h-[28rem]">
      <div
        className={cn(
          "absolute inset-0",
          "bg-size-[40px_40px]",
          "bg-[linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
          "dark:bg-[linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]",
        )}
      />
      {/* Radial gradient for the container to give a faded look */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-background mask-[radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
        <Canvas camera={{ position: [-5, 1, 2] }}>
          <ambientLight />
          <directionalLight position={[10, 10, 10]} intensity={5} />
          <Laptop scale={25} position={[0,-1,0]} />
          <OrbitControls enableZoom={false} minDistance={5} maxDistance={15} />
        </Canvas>
    </div>
  );
}
