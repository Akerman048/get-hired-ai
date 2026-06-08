import { prisma } from "@/lib/prisma";
import { Level } from "@/generated/prisma/enums";
import { updateQuestion } from "../../actions";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditQuestionPage({ params }: Props) {
  const { id } = await params;

  const question = await prisma.question.findUnique({
    where: { id },
  });

  const topics = await prisma.topic.findMany({
    orderBy: {
      name: "asc",
    },
  });

  if (!question) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="mb-8 text-4xl font-bold">Edit Question</h1>

      <form
        action={updateQuestion}
        className="rounded-xl border p-6 shadow-sm"
      >
        <input type="hidden" name="id" value={question.id} />

        <div className="mb-4">
          <label className="mb-2 block font-medium">Topic</label>

          <select
            name="topicId"
            required
            defaultValue={question.topicId}
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
            defaultValue={question.title}
            className="w-full rounded-lg border p-3"
          />
        </div>

        <div className="mb-4">
          <label className="mb-2 block font-medium">Answer</label>

          <textarea
            name="answer"
            required
            rows={5}
            defaultValue={question.answer}
            className="w-full rounded-lg border p-3"
          />
        </div>

        <div className="mb-4">
          <label className="mb-2 block font-medium">Explanation</label>

          <textarea
            name="explanation"
            rows={8}
            defaultValue={question.explanation ?? ""}
            className="w-full rounded-lg border p-3"
          />
        </div>

        <div className="mb-6">
          <label className="mb-2 block font-medium">Level</label>

          <select
            name="level"
            required
            defaultValue={question.level}
            className="w-full rounded-lg border p-3"
          >
            <option value={Level.JUNIOR}>Junior</option>
            <option value={Level.MIDDLE}>Middle</option>
            <option value={Level.SENIOR}>Senior</option>
          </select>
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