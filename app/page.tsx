import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-6xl p-8">
      <section className="py-20 text-center">
        <h1 className="mb-6 text-5xl font-bold">
          Prepare for your developer interview
        </h1>

        <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-500">
          Practice JavaScript, React, Next.js, TypeScript, Node.js and database
          questions with explanations, progress tracking and interview mode.
        </p>

        <div className="flex justify-center gap-4">
          <Link
            href="/topics"
            className="rounded-lg bg-black px-6 py-3 text-white"
          >
            Start learning
          </Link>

          <Link
            href="/interview"
            className="rounded-lg border px-6 py-3"
          >
            Try interview mode
          </Link>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        <div className="rounded-xl border p-6">
          <h2 className="mb-2 font-semibold">Question library</h2>
          <p className="text-gray-500">
            Learn from structured questions by topic and difficulty.
          </p>
        </div>

        <div className="rounded-xl border p-6">
          <h2 className="mb-2 font-semibold">Progress tracking</h2>
          <p className="text-gray-500">
            Mark questions as completed and track your preparation.
          </p>
        </div>

        <div className="rounded-xl border p-6">
          <h2 className="mb-2 font-semibold">Interview mode</h2>
          <p className="text-gray-500">
            Practice random questions like in a real interview.
          </p>
        </div>
      </section>
    </main>
  );
}