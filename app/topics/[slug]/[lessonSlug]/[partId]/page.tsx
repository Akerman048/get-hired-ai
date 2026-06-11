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
    <main className="min-h-screen bg-background px-4 py-8 text-foreground">
      <div className="mx-auto max-w-4xl">
        <Link
          href={`/topics/${slug}`}
          className="mb-6 inline-block rounded-xl border border-border px-4 py-2 text-sm text-muted transition hover:bg-card-hover"
        >
          ← Back to {part.lesson.topic.name}
        </Link>

        <section className="mb-8 rounded-3xl border border-border bg-card p-6 shadow-xl">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="mb-2 text-sm font-medium uppercase tracking-[0.25em] text-muted">
                Lesson progress
              </p>

              <h2 className="text-xl font-semibold">{part.lesson.title}</h2>
            </div>

            <div className="text-right">
              <p className="text-sm text-muted">
                {completed} / {total}
              </p>

              <p className="text-2xl font-bold">{progress}%</p>
            </div>
          </div>

          <div className="h-3 overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-success transition-all"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>
        </section>

        <section className="mb-8 rounded-3xl border border-border bg-card p-8 shadow-2xl">
          <p className="mb-3 text-sm text-muted">
            {part.lesson.topic.name} / {part.lesson.title}
          </p>

          <h1 className="text-5xl font-bold tracking-tight">{part.title}</h1>

          <p className="mt-4 max-w-2xl text-muted">
            Read the material, practice the questions, and mark this part as
            completed when you feel confident.
          </p>
        </section>

        <section className="mb-8 rounded-3xl border border-border bg-primary p-8 text-primary-foreground shadow-2xl">
          <MarkdownContent content={part.content} />
        </section>

        {part.questions.length > 0 && (
          <section className="mb-8 rounded-3xl border border-border bg-card p-6 shadow-xl">
            <div className="mb-6">
              <p className="mb-2 text-sm font-medium uppercase tracking-[0.25em] text-muted">
                Practice
              </p>

              <h2 className="text-3xl font-bold">Practice questions</h2>

              <p className="mt-2 text-sm text-muted">
                Write your answer, then use AI feedback to improve it.
              </p>
            </div>

            <div className="space-y-6">
              {part.questions.map((question) => {
                const questionAnswers = answers.filter(
                  (answer) => answer.questionId === question.id,
                );

                return (
                  <div
                    key={question.id}
                    className="rounded-2xl border border-border bg-background p-5"
                  >
                    <h3 className="mb-3 text-xl font-semibold">
                      {question.title}
                    </h3>

                    <div className="mb-5 rounded-2xl border border-border bg-card p-4">
                      <MarkdownContent content={question.prompt} />
                    </div>

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

        <form action={completePartAndRedirect} className="pb-8">
          <input type="hidden" name="partId" value={part.id} />
          <input type="hidden" name="nextPath" value={nextPath} />
          <input type="hidden" name="currentPath" value={path} />

          <button
            type="submit"
            className="w-full rounded-2xl bg-primary px-6 py-4 text-lg font-bold text-primary-foreground shadow-lg transition hover:scale-[1.01]"
          >
            {nextPart ? "Continue →" : "Finish lesson"}
          </button>
        </form>
      </div>
    </main>
  );
}