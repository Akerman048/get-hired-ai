import { prisma } from "@/lib/prisma";
import { Level } from "@/generated/prisma/enums";
import Link from "next/link";
import { createQuestion, deleteQuestion } from "./actions";

type Props = {
  searchParams?: Promise<{
    page?: string;
  }>;
};

const PAGE_SIZE = 20;

export default async function AdminQuestionsPage({ searchParams }: Props) {
  const resolvedSearchParams = await searchParams;

  const currentPage = Math.max(Number(resolvedSearchParams?.page || 1), 1);
  const skip = (currentPage - 1) * PAGE_SIZE;

  const [questions, parts, totalQuestions] = await Promise.all([
    prisma.question.findMany({
      select: {
        id: true,
        title: true,
        level: true,
        order: true,
        lessonPart: {
          select: {
            title: true,
            lesson: {
              select: {
                title: true,
                topic: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: PAGE_SIZE,
      skip,
    }),

    prisma.lessonPart.findMany({
      select: {
        id: true,
        title: true,
        lesson: {
          select: {
            title: true,
            topic: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: [
        {
          lesson: {
            topic: {
              name: "asc",
            },
          },
        },
        {
          lesson: {
            order: "asc",
          },
        },
        {
          order: "asc",
        },
      ],
    }),

    prisma.question.count(),
  ]);

  const totalPages = Math.max(Math.ceil(totalQuestions / PAGE_SIZE), 1);

  return (
    <main className="mx-auto max-w-5xl p-8">
      <h1 className="mb-8 text-4xl font-bold">Admin Questions</h1>

      <form
        action={createQuestion}
        className="mb-10 rounded-2xl border border-border bg-card p-6 shadow-sm"
      >
        <div className="mb-4">
          <label className="mb-2 block font-medium text-gray-200">
            Lesson Part
          </label>

          <select
            name="lessonPartId"
            required
            className="w-full rounded-xl border border-border bg-background p-3 text-foreground outline-none transition focus:border-primary"
          >
            {parts.map((part) => (
              <option key={part.id} value={part.id}>
                {part.lesson.topic.name} / {part.lesson.title} / {part.title}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="mb-2 block font-medium text-gray-200">
            Question title
          </label>

          <input
            name="title"
            required
            placeholder="Explain variables"
            className="w-full rounded-xl border border-border bg-background p-3 text-foreground outline-none transition placeholder:text-muted focus:border-primary"
          />
        </div>

        <div className="mb-4">
          <label className="mb-2 block font-medium text-gray-200">
            Prompt
          </label>

          <textarea
            name="prompt"
            required
            rows={6}
            placeholder="Explain what a variable is in your own words."
            className="w-full rounded-xl border border-border bg-background p-3 font-mono text-foreground outline-none transition placeholder:text-muted focus:border-primary"
          />
        </div>

        <div className="mb-4">
          <label className="mb-2 block font-medium text-gray-200">
            Order
          </label>

          <input
            name="order"
            type="number"
            defaultValue={0}
            className="w-full rounded-xl border border-border bg-background p-3 text-foreground outline-none transition focus:border-primary"
          />
        </div>

        <div className="mb-6">
          <label className="mb-2 block font-medium text-gray-200">
            Level
          </label>

          <select
            name="level"
            required
            className="w-full rounded-xl border border-border bg-background p-3 text-foreground outline-none transition focus:border-primary"
          >
            <option value={Level.JUNIOR}>Junior</option>
            <option value={Level.MIDDLE}>Middle</option>
            <option value={Level.SENIOR}>Senior</option>
          </select>
        </div>

        <button
          type="submit"
          className="cursor-pointer rounded-xl bg-primary px-5 py-3 font-semibold text-primary-foreground transition hover:scale-[1.02]"
        >
          Create Question
        </button>
      </form>

      <section>
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-2xl font-semibold">Existing Questions</h2>

          <span className="text-sm text-muted">
            Page {currentPage} of {totalPages}
          </span>
        </div>

        <div className="space-y-4">
          {questions.map((question) => (
            <article
              key={question.id}
              className="rounded-2xl border border-border bg-card p-5 shadow-sm"
            >
              <div className="mb-2 flex items-center justify-between gap-4">
                <h3 className="font-semibold">{question.title}</h3>

                <span className="rounded-full bg-secondary px-3 py-1 text-sm text-gray-200">
                  {question.level}
                </span>
              </div>

              <p className="mb-2 text-sm text-muted">
                {question.lessonPart.lesson.topic.name} /{" "}
                {question.lessonPart.lesson.title} / {question.lessonPart.title}
              </p>

              <p className="text-sm text-muted">Order: {question.order}</p>

              <form action={deleteQuestion} className="mt-4 flex gap-2">
                <input type="hidden" name="id" value={question.id} />

                <Link
                  href={`/admin/questions/${question.id}/edit`}
                  className="rounded-xl bg-secondary px-4 py-2 text-sm transition hover:bg-card-hover"
                >
                  Edit
                </Link>

                <button
                  type="submit"
                  className="cursor-pointer rounded-xl bg-danger px-4 py-2 text-sm font-medium text-gray-100 transition hover:scale-[1.02]"
                >
                  Delete
                </button>
              </form>
            </article>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-between gap-4">
          <Link
            href={`/admin/questions?page=${Math.max(currentPage - 1, 1)}`}
            aria-disabled={currentPage === 1}
            className={[
              "rounded-xl px-4 py-2 text-sm font-semibold transition",
              currentPage === 1
                ? "pointer-events-none bg-secondary text-muted opacity-50"
                : "bg-secondary hover:bg-card-hover",
            ].join(" ")}
          >
            ← Previous
          </Link>

          <Link
            href={`/admin/questions?page=${Math.min(
              currentPage + 1,
              totalPages,
            )}`}
            aria-disabled={currentPage === totalPages}
            className={[
              "rounded-xl px-4 py-2 text-sm font-semibold transition",
              currentPage === totalPages
                ? "pointer-events-none bg-secondary text-muted opacity-50"
                : "bg-secondary hover:bg-card-hover",
            ].join(" ")}
          >
            Next →
          </Link>
        </div>
      </section>
    </main>
  );
}