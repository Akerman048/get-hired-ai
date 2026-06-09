import { prisma } from "@/lib/prisma";
import { Level } from "@/generated/prisma/enums";
import Link from "next/link";
import { createQuestion, deleteQuestion } from "./actions";
import MarkdownContent from "@/components/ui/MarkdownContent";

export default async function AdminQuestionsPage() {
  const questions = await prisma.question.findMany({
    include: {
      lessonPart: {
        include: {
          lesson: {
            include: {
              topic: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

const parts = await prisma.lessonPart.findMany({
  include: {
    lesson: {
      include: {
        topic: true,
      },
    },
  },
});

  return (
    <main className="mx-auto max-w-5xl p-8">
      <h1 className="mb-8 text-4xl font-bold">Admin Questions</h1>

      <form
        action={createQuestion}
        className="mb-10 rounded-xl border p-6 shadow-sm"
      >
        <div className="mb-4">
          <label className="mb-2 block font-medium">Lesson Part</label>

          <select
            name="lessonPartId"
            required
            className="w-full rounded-lg border p-3"
          >
            {parts.map((part) => (
              <option key={part.id} value={part.id}>
                {part.lesson.topic.name} / {part.lesson.title} / {part.title}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="mb-2 block font-medium">Question title</label>

          <input
            name="title"
            required
            placeholder="Explain variables"
            className="w-full rounded-lg border p-3"
          />
        </div>

        <div className="mb-4">
          <label className="mb-2 block font-medium">Prompt</label>

          <textarea
            name="prompt"
            required
            rows={6}
            placeholder="Explain what a variable is in your own words."
            className="w-full rounded-lg border p-3 font-mono"
          />
        </div>

        <div className="mb-4">
          <label className="mb-2 block font-medium">Order</label>

          <input
            name="order"
            type="number"
            defaultValue={0}
            className="w-full rounded-lg border p-3"
          />
        </div>

        <div className="mb-6">
          <label className="mb-2 block font-medium">Level</label>

          <select
            name="level"
            required
            className="w-full rounded-lg border p-3"
          >
            <option value={Level.JUNIOR}>Junior</option>
            <option value={Level.MIDDLE}>Middle</option>
            <option value={Level.SENIOR}>Senior</option>
          </select>
        </div>

        <button
          type="submit"
          className="cursor-pointer rounded-lg bg-black px-5 py-3 text-white transition hover:opacity-80"
        >
          Create Question
        </button>
      </form>

      <section>
        <h2 className="mb-4 text-2xl font-semibold">Existing Questions</h2>

        <div className="space-y-4">
          {questions.map((question) => (
            <article
              key={question.id}
              className="rounded-xl border p-5 shadow-sm"
            >
              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-semibold">{question.title}</h3>

                <span className="rounded-full bg-gray-800 px-3 py-1 text-sm text-white">
                  {question.level}
                </span>
              </div>

              <p className="mb-2 text-sm text-gray-500">
                {question.lessonPart.lesson.topic.name} /{" "}
                {question.lessonPart.lesson.title} / {question.lessonPart.title}
              </p>

              <MarkdownContent content={question.prompt} />

              <form action={deleteQuestion} className="mt-4">
                <input type="hidden" name="id" value={question.id} />

                <Link
                  href={`/admin/questions/${question.id}/edit`}
                  className="mr-2 rounded-lg bg-gray-700 px-4 py-2 text-md text-white transition hover:opacity-80"
                >
                  Edit
                </Link>

                <button
                  type="submit"
                  className="cursor-pointer rounded-lg bg-red-600 px-2 py-1 text-sm text-white transition hover:opacity-80"
                >
                  Delete
                </button>
              </form>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}