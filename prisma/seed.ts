import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../lib/generated/prisma/client"

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const NEWS_POST_COUNT = 20;
const ORG_COUNT = 20;
const TRAINEE_COUNT = 40;

const pick = <T>(items: T[]) => items[Math.floor(Math.random() * items.length)];
const pad = (num: number, size = 3) => num.toString().padStart(size, "0");

const newsAdjectives = [
  "Local",
  "Regional",
  "National",
  "Community",
  "Youth",
  "Tech",
  "Health",
  "Education",
  "Sports",
  "Culture",
  "Green",
  "Creative",
  "Startup",
  "Civic",
  "Future",
];
const newsNouns = [
  "Summit",
  "Workshop",
  "Forum",
  "Initiative",
  "Program",
  "Campaign",
  "Meetup",
  "Showcase",
  "Bootcamp",
  "Clinic",
  "Expo",
  "Challenge",
  "Drive",
  "Launch",
  "Partnership",
];
const newsTopics = [
  "digital skills",
  "green jobs",
  "community health",
  "entrepreneurship",
  "public safety",
  "arts and culture",
  "financial literacy",
  "career readiness",
  "civic engagement",
  "youth leadership",
];

const orgPrefixes = [
  "Alliance",
  "Foundation",
  "Institute",
  "Center",
  "Council",
  "Association",
  "Network",
  "Hub",
  "Collective",
  "Partners",
];
const orgThemes = [
  "Innovation",
  "Learning",
  "Community",
  "Sustainability",
  "Technology",
  "Health",
  "Youth",
  "Creativity",
  "Economic",
  "Civic",
];
const orgLocations = [
  "Manila",
  "Quezon City",
  "Makati",
  "Cebu City",
  "Davao City",
  "Baguio",
  "Iloilo City",
  "Cagayan de Oro",
  "Bacolod",
  "Taguig",
];

const firstNames = [
  "Ari",
  "Jules",
  "Mara",
  "Noel",
  "Kai",
  "Sam",
  "Rhea",
  "Inez",
  "Cal",
  "Tia",
  "Leo",
  "Nia",
  "Pia",
  "Omar",
  "Elle",
];
const lastNames = [
  "Santos",
  "Reyes",
  "Garcia",
  "Cruz",
  "Torres",
  "Lim",
  "Navarro",
  "Morales",
  "Flores",
  "Ramos",
  "Gonzales",
  "Lopez",
  "Castro",
  "Diaz",
  "Velasco",
];
const skillsPool = [
  "Communication",
  "Teamwork",
  "Customer Service",
  "Data Entry",
  "Graphic Design",
  "Social Media",
  "Project Planning",
  "Public Speaking",
  "Event Support",
  "Research",
  "MS Office",
  "Digital Marketing",
  "Content Writing",
  "Problem Solving",
  "Leadership",
];

function buildNewsPosts(count: number) {
  const posts = [] as {
    title: string;
    content: string;
    featuredImage: null;
    imageGallery: string[];
    status: boolean;
  }[];

  for (let i = 1; i <= count; i += 1) {
    const title = `${pick(newsAdjectives)} ${pick(newsNouns)} ${i}`;
    const content = `Highlights from the ${pick(newsTopics)} session and key takeaways from participants.`;
    posts.push({
      title,
      content,
      featuredImage: null,
      imageGallery: [],
      status: Math.random() > 0.35,
    });
  }

  return posts;
}

function buildOrganizations(count: number) {
  const orgs = [] as {
    name: string;
    acronym: string;
    location: string;
    profilePhoto: null;
    trainingStartedAt: Date;
  }[];

  for (let i = 1; i <= count; i += 1) {
    const theme = pick(orgThemes);
    const prefix = pick(orgPrefixes);
    const name = `${theme} ${prefix}`;
    const acronym = `${theme[0]}${prefix[0]}${pad(i)}`.toUpperCase();
    const location = pick(orgLocations);
    const trainingStartedAt = new Date(2023 + (i % 3), i % 12, 1 + (i % 26));

    orgs.push({
      name,
      acronym,
      location,
      profilePhoto: null,
      trainingStartedAt,
    });
  }

  return orgs;
}

function buildTrainees(count: number, organizationIds: string[]) {
  const trainees = [] as {
    fullName: string;
    email: string;
    phoneNumber: string;
    address: string;
    skills: string[];
    profilePhoto: null;
    organizationId: string;
  }[];

  for (let i = 1; i <= count; i += 1) {
    const first = pick(firstNames);
    const last = pick(lastNames);
    const fullName = `${first} ${last}`;
    const email = `${first.toLowerCase()}.${last.toLowerCase()}${pad(i)}@example.com`;
    const phoneNumber = `09${pad(10 + (i % 90), 2)}${pad(i, 4)}`;
    const address = `${1 + (i % 120)} ${pick(orgLocations)}`;
    const skills = [pick(skillsPool), pick(skillsPool), pick(skillsPool)].filter(
      (value, index, list) => list.indexOf(value) === index
    );

    trainees.push({
      fullName,
      email,
      phoneNumber,
      address,
      skills,
      profilePhoto: null,
      organizationId: pick(organizationIds),
    });
  }

  return trainees;
}

async function main() {
  await prisma.trainee.deleteMany();
  await prisma.organization.deleteMany();
  await prisma.newsPost.deleteMany();

  const newsPosts = buildNewsPosts(NEWS_POST_COUNT);
  const organizations = buildOrganizations(ORG_COUNT);

  await prisma.newsPost.createMany({ data: newsPosts });
  await prisma.organization.createMany({ data: organizations });

  const orgRecords = await prisma.organization.findMany({ select: { id: true } });
  const organizationIds = orgRecords.map((org) => org.id);

  const trainees = buildTrainees(TRAINEE_COUNT, organizationIds);
  await prisma.trainee.createMany({ data: trainees });

  console.log({
    newsPosts: newsPosts.length,
    organizations: organizations.length,
    trainees: trainees.length,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
