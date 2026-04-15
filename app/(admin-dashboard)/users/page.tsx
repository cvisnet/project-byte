import prisma from "@/lib/db";

import { DataTable } from "./data-table";
import { columns, User } from "./columns";

export default async function UsersPage() {

  const user = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  })

  const data: User[] = user.map(user => ({
    id: user.id,
    email: user.email,
    status: user.isSuspended,
    role: user.role,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  }))



  return (
    <>

      <DataTable columns={columns} data={data} />
    </>
  );
}
