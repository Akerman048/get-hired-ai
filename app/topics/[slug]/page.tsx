import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import BackButton from "@/components/ui/BackButton";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function TopicPage({ params }: Props) {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const { slug } = await params;

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      email: session.user.email,
    },
  });

  const topic = await prisma.topic.findUnique({
    where: { slug },
    include: {
      lessons: {
        orderBy: {
          order: "asc",
        },
        include: {
          parts: {
            orderBy: {
              order: "asc",
            },
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
  });

  if (!topic) {
    notFound();
  }

  const totalLessons = topic.lessons.length;

  const completedLessons = topic.lessons.filter((lesson) => {
    const totalParts = lesson.parts.length;

    if (totalParts === 0) {
      return false;
    }

    const completedParts = lesson.parts.filter(
      (part) => part.progress.length > 0,
    ).length;

    return completedParts === totalParts;
  }).length;

  return (
    <main className="mx-auto max-w-5xl p-8">
      <BackButton text="⬅️ Back" />

      <h1 className="mb-2 mt-4 text-4xl font-bold">{topic.name}</h1>

      <p className="mb-8 text-gray-500">
        Lessons: {completedLessons} / {totalLessons} completed
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {topic.lessons.map((lesson) => {
          const totalParts = lesson.parts.length;

          const completedParts = lesson.parts.filter(
            (part) => part.progress.length > 0,
          ).length;

          const lessonProgress =
            totalParts > 0
              ? Math.round((completedParts / totalParts) * 100)
              : 0;

          return (
            <Link
              key={lesson.id}
              href={`/topics/${topic.slug}/${lesson.slug}`}
              className="group rounded-2xl border border-slate-200 bg-mist-300 p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-slate-400 hover:shadow-lg"
            >
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-xl font-semibold">{lesson.title}</h2>

                <span className="rounded-full bg-slate-800 px-3 py-1 text-sm text-white">
                  {lessonProgress}%
                </span>
              </div>

              {lesson.description && (
                <p className="mb-4 mt-2 line-clamp-3 text-sm text-gray-500">
                  {lesson.description}
                </p>
              )}

              <p className="mb-3 text-sm text-gray-500">
                {completedParts} / {totalParts} parts completed
              </p>

              <div className="h-2 overflow-hidden rounded-full bg-slate-300">
                <div
                  className="h-full bg-green-600 transition-all"
                  style={{
                    width: `${lessonProgress}%`,
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
