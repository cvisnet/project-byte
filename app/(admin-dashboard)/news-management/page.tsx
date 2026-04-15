import prisma from "@/lib/db";

import { DataTable } from "./data-table";
import { columns, NewsPost } from "./columns";

export default async function NewsManagementPage() {

  const news = await prisma.newsPost.findMany({
    orderBy: { createdAt: "desc" },
  })

  const data: NewsPost[] = news.map(news => ({
    id: news.id,
    title: news.title,
    status: news.status,
    createdAt: news.createdAt.toISOString(),
    updatedAt: news.updatedAt.toISOString(),
  }))



  return (
    <>

      <DataTable columns={columns} data={data} />
    </>
  );
}
