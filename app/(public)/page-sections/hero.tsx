"use client"

import { GridBackground } from "../../../components/grid-background";

export default function Hero() {
  return (
    <>
      <div className="relative mx-auto my-10 flex max-w-[96rem] flex-row items-center justify-center bg-background gap-10 px-8 py-20 ">
        <div className="flex-1">
        <h1 className="text-6xl font-extrabold text-[#154091] text-shadow-lg">Building Youth Through Technology Empowerment <span className="text-[#edd153]">Project</span></h1>
        <p className="mt-8 mb-4 text-lg text-justify"><strong>is a multi-sectoral technology training program</strong> that empowers youth with in-demand digital skills through hands-on, project-based learning.</p>

        <p className="my-4 text-lg text-justify">In partnership with government and non-government organizations, BYTE offers practical courses in operating systems, Linux, networking, server management, artificial intelligence, and web development.</p>

        <p className="my-4 text-lg text-justify">Designed to bridge the gap between theory and real-world application, the program equips learners with the skills to build applications, manage servers, and deploy modern systems—preparing them for careers in the IT and tech industry.</p>
      </div>

        <div className="flex-1 rounded-4xl overflow-hidden">
          <GridBackground />
        </div>
      </div>
    </>
  );
}
