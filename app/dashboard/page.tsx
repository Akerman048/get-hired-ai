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

  const topics = await prisma.topic.findMany({
    include: {
      lessons: {
        include: {
          parts: {
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
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  const getTopicParts = (topic: (typeof topics)[number]) => {
    return topic.lessons.flatMap((lesson) => lesson.parts);
  };

  const totalParts = topics.reduce((sum, topic) => {
    return sum + getTopicParts(topic).length;
  }, 0);

  const completedParts = topics.reduce((sum, topic) => {
    const parts = getTopicParts(topic);

    return sum + parts.filter((part) => part.progress.length > 0).length;
  }, 0);

  return (
    <main className="mx-auto max-w-5xl p-8">
      <h1 className="mb-2 text-4xl font-bold">Dashboard</h1>

      <p className="mb-8 text-gray-500">
        Progress: {completedParts} / {totalParts} completed
      </p>

      <div className="space-y-4">
        {topics.map((topic) => {
          const parts = getTopicParts(topic);

          const completed = parts.filter(
            (part) => part.progress.length > 0,
          ).length;

          const total = parts.length;

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