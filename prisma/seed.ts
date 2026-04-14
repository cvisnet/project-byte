import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { AdminRole, PrismaClient } from "../lib/generated/prisma/client";

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// TODO: put your super admin email here before running `npx tsx prisma/seed.ts`
const SUPER_ADMIN_EMAIL = "support@ishare.com.ph";

async function main() {
  if (!SUPER_ADMIN_EMAIL) {
    throw new Error(
      "SUPER_ADMIN_EMAIL is empty. Edit prisma/seed.ts and set it before seeding."
    );
  }

  const user = await prisma.user.upsert({
    where: { email: SUPER_ADMIN_EMAIL },
    update: { role: AdminRole.SUPERADMIN },
    create: {
      email: SUPER_ADMIN_EMAIL,
      emailVerified: new Date(),
      role: AdminRole.SUPERADMIN,
    },
  });

  console.log("Seeded super admin:", {
    id: user.id,
    email: user.email,
    role: user.role,
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
