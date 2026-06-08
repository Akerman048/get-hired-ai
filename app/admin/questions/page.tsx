import { prisma } from "@/lib/prisma";
import { Level } from "@/generated/prisma/enums";
import Link from "next/link";
import { createQuestion, deleteQuestion } from "./actions";

export default async function AdminQuestionsPage() {
  const topics = await prisma.topic.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const questions = await prisma.question.findMany({
    include: {
      topic: true,
    },
    orderBy: {
      createdAt: "desc",
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
          <label className="mb-2 block font-medium">Topic</label>

          <select
            name="topicId"
            required
            className="w-full rounded-lg border p-3"
          >
            {topics.map((topic) => (
              <option key={topic.id} value={topic.id}>
                {topic.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="mb-2 block font-medium">Title</label>

          <input
            name="title"
            required
            className="w-full rounded-lg border p-3"
          />
        </div>

        <div className="mb-4">
          <label className="mb-2 block font-medium">Answer</label>

          <textarea
            name="answer"
            required
            rows={5}
            className="w-full rounded-lg border p-3"
          />
        </div>

        <div className="mb-4">
          <label className="mb-2 block font-medium">Explanation</label>

          <textarea
            name="explanation"
            rows={8}
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
          className="rounded-lg bg-black px-5 py-3 text-white transition hover:opacity-80 cursor-pointer"
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
                {question.topic.name}
              </p>

              <p className="mb-2 text-sm">{question.answer}</p>

              {question.explanation && (
                <p className="mb-4 text-sm text-gray-600">
                  {question.explanation}
                </p>
              )}

              <form action={deleteQuestion} >
                <input type="hidden" name="id" value={question.id} />
                <Link
                  href={`/admin/questions/${question.id}/edit`}
                  className="rounded-lg bg-gray-700 px-4 py-2 mr-2 text-md text-white transition hover:opacity-80 cursor-pointer"
                >
                  Edit
                </Link>
                <button
                  type="submit"
                  className="rounded-lg bg-red-600 px-2 py-1 text-sm text-white transition hover:opacity-80 cursor-pointer"
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
