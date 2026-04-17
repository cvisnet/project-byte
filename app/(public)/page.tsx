import Footer from "@/app/(public)/page-sections/footer";
import Hero from "@/app/(public)/page-sections/hero";
import LatestNews from "@/app/(public)/page-sections/latest-news/latest-news-server";
import ProgramBlueprint from "@/app/(public)/page-sections/program-blueprint/program-blueprint";

export const revalidate = 60;

export default function Home() {
  return (
    <>
      <Hero />
      <ProgramBlueprint />
      <LatestNews />
      <Footer />
    </>
  );
}
