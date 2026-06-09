import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createLesson, deleteLesson } from "./actions";
import MarkdownContent from "@/components/ui/MarkdownContent";

export default async function AdminLessonsPage() {
  const topics = await prisma.topic.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const lessons = await prisma.lesson.findMany({
    include: {
      topic: true,
      _count: {
        select: {
          parts: true,
        },
      },
    },
    orderBy: [
      {
        topic: {
          name: "asc",
        },
      },
      {
        order: "asc",
      },
    ],
  });

  return (
    <main className="mx-auto max-w-5xl p-8">
      <h1 className="mb-8 text-4xl font-bold">Admin Lessons</h1>

      <form
        action={createLesson}
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
          <label className="mb-2 block font-medium">Lesson title</label>

          <input
            name="title"
            required
            placeholder="Variables"
            className="w-full rounded-lg border p-3"
          />
        </div>

        <div className="mb-4">
          <label className="mb-2 block font-medium">Description</label>

          <textarea
            name="description"
            rows={8}
            placeholder="Markdown description..."
            className="w-full rounded-lg border p-3 font-mono"
          />
        </div>

        <div className="mb-6">
          <label className="mb-2 block font-medium">Order</label>

          <input
            name="order"
            type="number"
            defaultValue={0}
            className="w-full rounded-lg border p-3"
          />
        </div>

        <button
          type="submit"
          className="rounded-lg bg-black px-5 py-3 text-white transition hover:opacity-80"
        >
          Create Lesson
        </button>
      </form>

      <section>
        <h2 className="mb-4 text-2xl font-semibold">Existing Lessons</h2>

        <div className="space-y-4">
          {lessons.map((lesson) => (
            <article
              key={lesson.id}
              className="rounded-xl border p-5 shadow-sm"
            >
              <div className="mb-3 flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold">{lesson.title}</h3>

                  <p className="text-sm text-gray-500">
                    {lesson.topic.name} / {lesson.slug}
                  </p>

                  <p className="text-sm text-gray-500">
                    Parts: {lesson._count.parts}
                  </p>

                  <p className="text-sm text-gray-500">Order: {lesson.order}</p>
                </div>

                <div className="flex gap-2">
                  <Link
                    href={`/admin/lessons/${lesson.id}/edit`}
                    className="rounded-lg bg-gray-100 px-4 py-2 text-sm transition hover:bg-gray-200"
                  >
                    Edit
                  </Link>

                  <form action={deleteLesson}>
                    <input type="hidden" name="id" value={lesson.id} />

                    <button
                      type="submit"
                      className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white transition hover:opacity-80"
                    >
                      Delete
                    </button>
                  </form>
                </div>
              </div>

              {lesson.description && (
                <div className="mt-4 text-sm">
                  <MarkdownContent content={lesson.description} />
                </div>
              )}
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
