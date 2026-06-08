import Link from "next/link";
import { auth } from "@/auth";
import { logout } from "@/app/actions/auth";

export async function Header() {
  const session = await auth();

  return (
    <header className="border-b">
      <nav className="mx-auto flex max-w-6xl items-center justify-between p-4">
        <Link href="/" className="text-xl font-bold">
          Get Hired
        </Link>

        <div className="flex items-center gap-4 text-sm">
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/topics">Topics</Link>
          <Link href="/search">Search</Link>
          <Link href="/interview">Interview</Link>
          <Link href="/admin/questions">Admin</Link>

          {session?.user ? (
            <form
              action={logout}
            >
              <button
                type="submit"
                className="rounded-lg border px-3 py-1"
              >
                Logout
              </button>
            </form>
          ) : (
            <Link href="/login">Login</Link>
          )}
        </div>
      </nav>
    </header>
  );
}