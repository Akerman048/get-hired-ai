import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function RoadmapsPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      email: session.user.email,
    },
  });

  const roadmaps = await prisma.roadmap.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="min-h-screen bg-[#041325] px-4 py-8 text-[#fff3da]">
      <div className="mx-auto max-w-6xl">
        <section className="mb-8 rounded-3xl border border-[#fff3da]/10 bg-[#fff3da]/5 p-8 shadow-2xl">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.3em] text-[#fff3da]/60">
            AI learning plans
          </p>

          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <h1 className="text-5xl font-bold tracking-tight">
                AI Roadmaps
              </h1>

              <p className="mt-4 max-w-2xl text-[#fff3da]/70">
                Personalized learning plans generated from your interview
                results and weak areas.
              </p>
            </div>

            <Link
              href="/interview"
              className="rounded-2xl bg-[#fff3da] px-6 py-3 font-semibold text-[#041325] transition hover:scale-[1.02] hover:bg-white"
            >
              Start interview
            </Link>
          </div>
        </section>

        <section className="mb-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-[#fff3da]/10 bg-[#fff3da]/5 p-6">
            <p className="text-sm text-[#fff3da]/60">Total roadmaps</p>
            <h2 className="mt-2 text-4xl font-bold">{roadmaps.length}</h2>
            <p className="mt-2 text-sm text-[#fff3da]/60">
              Generated from interview results
            </p>
          </div>

          <div className="rounded-2xl border border-[#fff3da]/10 bg-[#fff3da]/5 p-6">
            <p className="text-sm text-[#fff3da]/60">Latest roadmap</p>
            <h2 className="mt-2 line-clamp-1 text-2xl font-bold">
              {roadmaps[0]?.title ?? "Not created yet"}
            </h2>
            <p className="mt-2 text-sm text-[#fff3da]/60">
              Continue your most recent plan
            </p>
          </div>

          <Link
            href="/interview"
            className="rounded-2xl border border-[#fff3da]/10 bg-[#fff3da] p-6 text-[#041325] transition hover:scale-[1.02] hover:bg-white"
          >
            <p className="text-sm font-medium opacity-70">Need a new plan?</p>
            <h2 className="mt-2 text-2xl font-bold">Take interview →</h2>
          </Link>
        </section>

        {roadmaps.length === 0 ? (
          <section className="rounded-3xl border border-[#fff3da]/10 bg-[#fff3da]/5 p-8 shadow-xl">
            <div className="max-w-2xl">
              <p className="mb-3 text-sm font-medium uppercase tracking-[0.25em] text-[#fff3da]/50">
                No roadmaps yet
              </p>

              <h2 className="text-3xl font-bold">
                Generate your first AI roadmap
              </h2>

              <p className="mt-4 text-[#fff3da]/65">
                Complete an interview, wait for AI feedback, then generate a
                focused 4-week learning roadmap based on your weak answers.
              </p>

              <Link
                href="/interview"
                className="mt-6 inline-block rounded-2xl bg-[#fff3da] px-6 py-3 font-semibold text-[#041325] transition hover:bg-white"
              >
                Start your first interview
              </Link>
            </div>
          </section>
        ) : (
          <section>
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">Your roadmaps</h2>
                <p className="mt-1 text-sm text-[#fff3da]/60">
                  Open a roadmap and track your weekly progress.
                </p>
              </div>

              <span className="rounded-full border border-[#fff3da]/10 bg-[#fff3da]/5 px-4 py-2 text-sm text-[#fff3da]/70">
                {roadmaps.length} roadmaps
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {roadmaps.map((roadmap) => (
                <Link
                  key={roadmap.id}
                  href={`/roadmaps/${roadmap.id}`}
                  className="group rounded-2xl border border-[#fff3da]/10 bg-[#fff3da]/5 p-6 shadow-lg transition hover:-translate-y-1 hover:bg-[#fff3da]/10"
                >
                  <div className="mb-5 flex items-start justify-between gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#fff3da] text-lg font-bold text-[#041325]">
                      AI
                    </div>

                    <span className="rounded-full bg-[#fff3da]/10 px-3 py-1 text-xs text-[#fff3da]/70">
                      {roadmap.createdAt.toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="mb-2 text-xl font-semibold transition group-hover:text-white">
                    {roadmap.title}
                  </h3>

                  <p className="line-clamp-3 text-sm text-[#fff3da]/60">
                    {roadmap.summary ??
                      "Personalized roadmap based on your weak interview answers."}
                  </p>

                  <div className="mt-5 flex items-center justify-between">
                    <span className="text-sm font-medium text-[#fff3da]/80">
                      Open roadmap
                    </span>

                    <span className="rounded-full bg-[#fff3da]/10 px-3 py-1 text-sm transition group-hover:bg-[#fff3da] group-hover:text-[#041325]">
                      →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}