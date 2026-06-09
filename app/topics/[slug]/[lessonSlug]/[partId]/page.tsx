import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";

import MarkdownContent from "@/components/ui/MarkdownContent";
import AnswerForm from "@/components/question/AnswerForm";
import AnswersList from "@/components/question/AnswersList";
import { completePartAndRedirect } from "./actions";

type Props = {
  params: Promise<{
    slug: string;
    lessonSlug: string;
    partId: string;
  }>;
};

export default async function LessonPartPage({ params }: Props) {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const { slug, lessonSlug, partId } = await params;

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      email: session.user.email,
    },
  });

  const part = await prisma.lessonPart.findUnique({
    where: {
      id: partId,
    },
    include: {
      lesson: {
        include: {
          topic: true,
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
      questions: {
        orderBy: {
          order: "asc",
        },
      },
    },
  });

  if (
    !part ||
    part.lesson.slug !== lessonSlug ||
    part.lesson.topic.slug !== slug
  ) {
    notFound();
  }

  const parts = part.lesson.parts;

  const currentIndex = parts.findIndex((item) => item.id === part.id);
  const nextPart = parts[currentIndex + 1];

  const total = parts.length;

  const completed = parts.filter((item) => item.progress.length > 0).length;

  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  const path = `/topics/${slug}/${lessonSlug}/${part.id}`;

  const nextPath = nextPart
    ? `/topics/${slug}/${lessonSlug}/${nextPart.id}`
    : `/topics/${slug}`;

  const questionIds = part.questions.map((question) => question.id);

  const answers = await prisma.userAnswer.findMany({
    where: {
      userId: user.id,
      questionId: {
        in: questionIds,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="mx-auto max-w-3xl p-8">
      <Link
        href={`/topics/${slug}`}
        className="mb-6 inline-block rounded-lg border px-4 py-2"
      >
        ← Back to {part.lesson.topic.name}
      </Link>

      <div className="mb-8 rounded-xl border p-5">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-sm font-semibold">
            {part.lesson.title}: {completed} / {total}
          </p>

          <p className="text-sm font-semibold">{progress}%</p>
        </div>

        <div className="h-3 overflow-hidden rounded-full bg-slate-300">
          <div
            className="h-full bg-green-600 transition-all"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>
      </div>

      <p className="mb-2 text-sm text-gray-500">
        {part.lesson.topic.name} / {part.lesson.title}
      </p>

      <h1 className="mb-6 text-4xl font-bold">{part.title}</h1>

      <section className="mb-8 rounded-xl border p-6">
        <MarkdownContent content={part.content} />
      </section>

      {part.questions.length > 0 && (
        <section className="mb-8 rounded-xl border p-6">
          <h2 className="mb-4 text-2xl font-semibold">Practice</h2>

          <div className="space-y-6">
            {part.questions.map((question) => {
              const questionAnswers = answers.filter(
                (answer) => answer.questionId === question.id,
              );

              return (
                <div key={question.id} className="rounded-xl border p-4">
                  <h3 className="mb-2 text-xl font-semibold">
                    {question.title}
                  </h3>

                  <MarkdownContent content={question.prompt} />

                  <AnswerForm
                    questionId={question.id}
                    questionText={question.prompt}
                    path={path}
                  />

                  <AnswersList answers={questionAnswers} path={path} />
                </div>
              );
            })}
          </div>
        </section>
      )}

      <form action={completePartAndRedirect}>
        <input type="hidden" name="partId" value={part.id} />
        <input type="hidden" name="nextPath" value={nextPath} />
        <input type="hidden" name="currentPath" value={path} />

        <button
          type="submit"
          className="rounded-lg bg-black px-5 py-3 text-white transition hover:opacity-80"
        >
          {nextPart ? "Continue →" : "Finish lesson"}
        </button>
      </form>
    </main>
  );
}