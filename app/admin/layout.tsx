import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (session?.user?.email !== process.env.ADMIN_EMAIL) {
    redirect("/dashboard");
  }
  return (
    <main className="flex min-h-screen">
      <aside className="w-64 border-r p-6">
        <h2 className="mb-6 text-2xl font-bold">Admin</h2>

        <nav className="flex flex-col gap-3">
          <Link href="/admin">Dashboard</Link>
          <Link href="/admin/topics">Topics</Link>
          <Link href="/admin/lessons">Lessons</Link>
          <Link href="/admin/parts">Parts</Link>
          <Link href="/admin/questions">Questions</Link>
        </nav>
      </aside>

      <section className="flex-1 p-8">{children}</section>
    </main>
  );
}
