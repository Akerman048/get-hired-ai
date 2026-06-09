import { prisma } from "@/lib/prisma";
import { updateLesson } from "../../actions";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditLessonPage({ params }: Props) {
  const { id } = await params;

  const lesson = await prisma.lesson.findUnique({
    where: { id },
  });

  const topics = await prisma.topic.findMany({
    orderBy: {
      name: "asc",
    },
  });

  if (!lesson) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="mb-8 text-4xl font-bold">Edit Lesson</h1>

      <form
        action={updateLesson}
        className="rounded-xl border p-6 shadow-sm"
      >
        <input type="hidden" name="id" value={lesson.id} />

        <div className="mb-4">
          <label className="mb-2 block font-medium">Topic</label>

          <select
            name="topicId"
            required
            defaultValue={lesson.topicId}
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
            defaultValue={lesson.title}
            className="w-full rounded-lg border p-3"
          />
        </div>

        <div className="mb-4">
          <label className="mb-2 block font-medium">Description</label>

          <textarea
            name="description"
            rows={8}
            defaultValue={lesson.description ?? ""}
            className="w-full rounded-lg border p-3 font-mono"
          />
        </div>

        <div className="mb-6">
          <label className="mb-2 block font-medium">Order</label>

          <input
            name="order"
            type="number"
            defaultValue={lesson.order}
            className="w-full rounded-lg border p-3"
          />
        </div>

        <button
          type="submit"
          className="rounded-lg bg-black px-5 py-3 text-white transition hover:opacity-80"
        >
          Save Changes
        </button>
      </form>
    </main>
  );
}