import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createLessonPart, deleteLessonPart } from "./actions";
import MarkdownContent from "@/components/ui/MarkdownContent";

export default async function AdminPartsPage() {
  const lessons = await prisma.lesson.findMany({
    include: {
      topic: true,
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

  const parts = await prisma.lessonPart.findMany({
    include: {
      lesson: {
        include: {
          topic: true,
        },
      },
      _count: {
        select: {
          questions: true,
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
  });

  return (
    <main className="mx-auto max-w-5xl p-8">
      <h1 className="mb-8 text-4xl font-bold">Admin Parts</h1>

      <form
        action={createLessonPart}
        className="mb-10 rounded-xl border p-6 shadow-sm"
      >
        <div className="mb-4">
          <label className="mb-2 block font-medium">Lesson</label>

          <select
            name="lessonId"
            required
            className="w-full rounded-lg border p-3"
          >
            {lessons.map((lesson) => (
              <option key={lesson.id} value={lesson.id}>
                {lesson.topic.name} / {lesson.title}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="mb-2 block font-medium">Part title</label>

          <input
            name="title"
            required
            placeholder="What are Variables?"
            className="w-full rounded-lg border p-3"
          />
        </div>

        <div className="mb-4">
          <label className="mb-2 block font-medium">Content</label>

          <textarea
            name="content"
            required
            rows={10}
            placeholder="Markdown content..."
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
          Create Part
        </button>
      </form>

      <section>
        <h2 className="mb-4 text-2xl font-semibold">Existing Parts</h2>

        <div className="space-y-4">
          {parts.map((part) => (
            <article
              key={part.id}
              className="rounded-xl border p-5 shadow-sm"
            >
              <div className="mb-3 flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold">{part.title}</h3>

                  <p className="text-sm text-gray-500">
                    {part.lesson.topic.name} / {part.lesson.title}
                  </p>

                  <p className="text-sm text-gray-500">
                    Questions: {part._count.questions}
                  </p>

                  <p className="text-sm text-gray-500">
                    Order: {part.order}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Link
                    href={`/admin/parts/${part.id}/edit`}
                    className="rounded-lg bg-gray-100 px-4 py-2 text-sm transition hover:bg-gray-200"
                  >
                    Edit
                  </Link>

                  <form action={deleteLessonPart}>
                    <input type="hidden" name="id" value={part.id} />

                    <button
                      type="submit"
                      className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white transition hover:opacity-80"
                    >
                      Delete
                    </button>
                  </form>
                </div>
              </div>

              <div className="mt-4 text-sm">
                <MarkdownContent content={part.content} />
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}