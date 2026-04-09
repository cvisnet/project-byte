import Link from "next/link";
import CourseCard from "./partials/course-card";
import { ProjectCard } from "./partials/project-card";

export default function page() {
  return (
    <div className="relative mx-auto my-10 flex max-w-7xl flex-col items-start justify-center gap-10 px-6 pb-12">
      <div className="flex w-full flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <h1 className="text-3xl font-bold">Courses</h1>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            This course provides an introduction to the concepts, theories and
            components that serve as the bases for the design of classical and
            modern operating systems. Topics include process and memory
            management, process synchronization and file management.
          </p>
        </div>
        <Link
          href="/#contact"
          className="group inline-flex w-fit items-center gap-2 rounded-xl bg-brand-blue px-6 py-3 font-medium text-white transition-all hover:-translate-y-0.5 hover:bg-brand-blue-light"
        >
          Apply for BYTE
          <span className="transition-transform group-hover:translate-x-1">
            &rarr;
          </span>
        </Link>
      </div>
      <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Courses */}
        <div className="flex flex-col gap-4 lg:col-span-2">
          <CourseCard />
        </div>

        {/* Projects */}
        <div className="flex flex-col items-center gap-4 lg:col-span-1">
          <h2 className="text-2xl font-bold">Projects</h2>
          <ProjectCard />
        </div>
      </div>
    </div>
  );
}
