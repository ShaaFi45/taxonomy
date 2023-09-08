import { redirect } from "next/navigation"
import path from "path"
import { promises as fs } from "fs"
import { z } from "zod"
import { taskSchema } from "@/data/schema"
import { columns } from "@/components/columns"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { EmptyPlaceholder } from "@/components/empty-placeholder"
import { DashboardHeader } from "@/components/header"
import { PostCreateButton } from "@/components/post-create-button"
import { PostItem } from "@/components/post-item"
import { DashboardShell } from "@/components/shell"
import { DataTable } from "@/components/data-table"
async function getTasks() {
  const data = await fs.readFile(
    path.join(process.cwd(), "data/tasks.json")
  )

  const tasks = JSON.parse(data.toString())

  return z.array(taskSchema).parse(tasks)
}
// import { UserNav } from "@/components/user-nav"
// import { DataTablePagination } from "@/components/data-table-pagination"


export const metadata = {
  title: "Dashboard",
}

export default async function DashboardPage() {
  const user = await getCurrentUser()
  const tasks = await getTasks()
  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login")
  }

  const posts = await db.post.findMany({
    where: {
      authorId: user.id,
    },
    select: {
      id: true,
      title: true,
      published: true,
      createdAt: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  })

  return (

    <div>
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
            <p className="text-muted-foreground">
              Here&apos;s a list of your tasks for this month!
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {/* <UserNav /> */}
          </div>
        </div>
        {/* {posts?.length ? (
          <div className="divide-y divide-border rounded-md border">
            {posts.map((post) => (
              <PostItem key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <EmptyPlaceholder>
            <EmptyPlaceholder.Icon name="post" />
            <EmptyPlaceholder.Title>No posts created</EmptyPlaceholder.Title>
            <EmptyPlaceholder.Description>
              You don&apos;t have any posts yet. Start creating content.
            </EmptyPlaceholder.Description>
            <PostCreateButton variant="outline" />
          </EmptyPlaceholder>
        )} */}
        <DataTable data={tasks} columns={columns} />
      </div>
      {/* <DataTablePagination table={table} /> */}
    </div>
    // <DashboardShell>
    //   <DashboardHeader heading="Posts" text="Create and manage posts.">
    //     <PostCreateButton />
    //   </DashboardHeader>
    //   <div>
    //     {posts?.length ? (
    //       <div className="divide-y divide-border rounded-md border">
    //         {posts.map((post) => (
    //           <PostItem key={post.id} post={post} />
    //         ))}
    //       </div>
    //     ) : (
    //       <EmptyPlaceholder>
    //         <EmptyPlaceholder.Icon name="post" />
    //         <EmptyPlaceholder.Title>No posts created</EmptyPlaceholder.Title>
    //         <EmptyPlaceholder.Description>
    //           You don&apos;t have any posts yet. Start creating content.
    //         </EmptyPlaceholder.Description>
    //         <PostCreateButton variant="outline" />
    //       </EmptyPlaceholder>
    //     )}
    //   </div>
    // </DashboardShell>
  )
}
