import Link from "next/link";
import { prisma } from "@/lib/prisma";

import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      email: session.user.email,
    },
  });

  if (!user) {
    return <main className="p-8">User not found</main>;
  }

  const topics = await prisma.topic.findMany({
    include: {
      questions: {
        include: {
          progress: {
            where: {
              userId: user.id,
              completed: true,
            },
          },
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  const totalQuestions = topics.reduce(
    (sum, topic) => sum + topic.questions.length,
    0,
  );

  const completedQuestions = topics.reduce(
    (sum, topic) =>
      sum +
      topic.questions.filter((question) => question.progress.length > 0).length,
    0,
  );

  return (
    <main className="mx-auto max-w-5xl p-8">
      <h1 className="mb-2 text-4xl font-bold">Dashboard</h1>

      <p className="mb-8 text-gray-500">
        Progress: {completedQuestions} / {totalQuestions} completed
      </p>

      <div className="space-y-4">
        {topics.map((topic) => {
          const completed = topic.questions.filter(
            (question) => question.progress.length > 0,
          ).length;

          const total = topic.questions.length;

          return (
            <Link
              key={topic.id}
              href={`/topics/${topic.slug}`}
              className="block rounded-xl border p-5 shadow-sm transition hover:bg-slate-600"
            >
              <div className="mb-2 flex items-center justify-between">
                <h2 className="text-xl font-semibold">{topic.name}</h2>

                <span className="text-sm text-gray-500">
                  {completed} / {total}
                </span>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-slate-400">
                <div
                  className="h-full bg-slate-800"
                  style={{
                    width: total > 0 ? `${(completed / total) * 100}%` : "0%",
                  }}
                />
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
