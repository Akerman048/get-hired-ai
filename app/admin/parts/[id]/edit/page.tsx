import { prisma } from "@/lib/prisma";
import { updateLessonPart } from "../../actions";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditLessonPartPage({ params }: Props) {
  const { id } = await params;

  const [part, lessons] = await Promise.all([
    prisma.lessonPart.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        lessonId: true,
        title: true,
        content: true,
        order: true,
      },
    }),

    prisma.lesson.findMany({
      select: {
        id: true,
        title: true,
        topic: {
          select: {
            name: true,
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
    }),
  ]);

  if (!part) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="mb-8 text-4xl font-bold">Edit Part</h1>

      <form
        action={updateLessonPart}
        className="rounded-2xl border border-border bg-card p-6 shadow-sm"
      >
        <input type="hidden" name="id" value={part.id} />

        <div className="mb-4">
          <label className="mb-2 block font-medium text-gray-200">
            Lesson
          </label>

          <select
            name="lessonId"
            required
            defaultValue={part.lessonId}
            className="w-full rounded-xl border border-border bg-background p-3 text-foreground outline-none transition focus:border-primary"
          >
            {lessons.map((lesson) => (
              <option key={lesson.id} value={lesson.id}>
                {lesson.topic.name} / {lesson.title}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="mb-2 block font-medium text-gray-200">
            Part title
          </label>

          <input
            name="title"
            required
            defaultValue={part.title}
            className="w-full rounded-xl border border-border bg-background p-3 text-foreground outline-none transition placeholder:text-muted focus:border-primary"
          />
        </div>

        <div className="mb-4">
          <label className="mb-2 block font-medium text-gray-200">
            Content
          </label>

          <textarea
            name="content"
            required
            rows={12}
            defaultValue={part.content}
            className="w-full rounded-xl border border-border bg-background p-3 font-mono text-foreground outline-none transition placeholder:text-muted focus:border-primary"
          />
        </div>

        <div className="mb-6">
          <label className="mb-2 block font-medium text-gray-200">
            Order
          </label>

          <input
            name="order"
            type="number"
            defaultValue={part.order}
            className="w-full rounded-xl border border-border bg-background p-3 text-foreground outline-none transition focus:border-primary"
          />
        </div>

        <button
          type="submit"
          className="rounded-xl bg-primary px-5 py-3 font-semibold text-primary-foreground transition hover:scale-[1.02]"
        >
          Save Changes
        </button>
      </form>
    </main>
  );
}
