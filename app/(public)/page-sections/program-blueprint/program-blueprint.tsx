"use client";

import Objectives from "./objectives";
import ResourcesNeeded from "./resources-needed";

export default function ProgramBlueprint() {
  return (
    <section className="relative mx-auto my-10 flex max-w-7xl flex-col items-center justify-center gap-4 px-6 py-20">
      <div className="mb-12 flex flex-col items-center gap-4">
        <h1 className="text-4xl font-bold text-brand-blue lg:text-5xl">
          Program <span className="text-[#edd153]">Blueprint</span>
        </h1>
        <p className="max-w-2xl text-center text-muted-foreground">
          Our roadmap outlining what we aim to achieve and the tools, people,
          and resources needed to make it happen.
        </p>
      </div>

      <div className="relative flex w-full flex-col gap-8 rounded-2xl  p-6 lg:flex-row lg:p-8">
        <Objectives />
        <ResourcesNeeded />
      </div>
    </section>
  );
}
