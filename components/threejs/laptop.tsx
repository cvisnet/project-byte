"use client"

import { useGLTF } from "@react-three/drei";
import { DRACOLoader } from "three-stdlib";
import type { Group } from "three";

type LaptopProps = {
  /** Position of the model in world space */
  position?: [number, number, number];
  /** Uniform or per-axis scale */
  scale?: number | [number, number, number];
};

export default function Laptop({
  position = [0, 0, 0],
  scale = 1,
}: LaptopProps) {
  const { scene } = useGLTF(
    "/glb-files/ubuntu_24.04_laptop.glb",
    true,
    true,
    (loader) => {
      // Initialize and attach a DRACO decoder (adjust path to your deployment)
      const dracoLoader = new DRACOLoader();
      // Set this to wherever your Draco wasm/decoder files are hosted
      // Commonly `/draco/` with files like draco_decoder.wasm, draco_wasm_wrapper.js, draco_decoder.js
      dracoLoader.setDecoderPath("/draco/");
      // Some loaders expose setDRACOLoader; cast for compatibility
      (loader as any).setDRACOLoader?.(dracoLoader);
    }
  ) as { scene: Group };

  return <primitive object={scene} scale={scale} position={position} />;
}

// Optionally preload the asset to reduce runtime stalls
useGLTF.preload("/glb-files/ubuntu_24.04_laptop.glb");
