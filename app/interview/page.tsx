import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Level } from "@/generated/prisma/enums";

type Props = {
  searchParams: Promise<{
    topic?: string;
    level?: Level;
  }>;
};

export default async function InterviewPage({ searchParams }: Props) {
  const { topic, level } = await searchParams;

  const topics = await prisma.topic.findMany({
    orderBy: {
      name: "asc",
    },
  });

 const questions = await prisma.question.findMany({
  where: {
    topic: topic
      ? {
          slug: topic,
        }
      : undefined,
    level: level || undefined,
  },
  include: {
    topic: true,
  },
  take: 1,
});

const randomQuestion = questions[0];

  return (
    <main className="mx-auto max-w-4xl p-8">
      <h1 className="mb-8 text-4xl font-bold">Interview Mode</h1>

      <form className="mb-8 grid gap-4 md:grid-cols-3">
        <select
          name="topic"
          defaultValue={topic ?? ""}
          className="rounded-lg border p-3"
        >
          <option value="">All topics</option>

          {topics.map((topic) => (
            <option key={topic.id} value={topic.slug}>
              {topic.name}
            </option>
          ))}
        </select>

        <select
          name="level"
          defaultValue={level ?? ""}
          className="rounded-lg border p-3"
        >
          <option value="">All levels</option>
          <option value={Level.JUNIOR}>Junior</option>
          <option value={Level.MIDDLE}>Middle</option>
          <option value={Level.SENIOR}>Senior</option>
        </select>

        <button
          type="submit"
          className="rounded-lg bg-black px-5 py-3 text-white"
        >
          Start
        </button>
      </form>

      {!randomQuestion ? (
        <p className="text-gray-500">No questions found.</p>
      ) : (
        <section className="rounded-xl border p-6 shadow-sm">
          <p className="mb-2 text-sm text-gray-500">
            {randomQuestion.topic.name} · {randomQuestion.level}
          </p>

          <h2 className="mb-6 text-2xl font-semibold">
            {randomQuestion.title}
          </h2>

          <details className="mb-6 rounded-xl border p-5">
            <summary className="cursor-pointer font-medium">
              Show answer
            </summary>

            <p className="mt-4">{randomQuestion.answer}</p>

            {randomQuestion.explanation && (
              <p className="mt-4 text-gray-600">
                {randomQuestion.explanation}
              </p>
            )}
          </details>

          <Link
            href={`/topics/${randomQuestion.topic.slug}/${randomQuestion.id}`}
            className="rounded-lg bg-black px-5 py-3 text-white"
          >
            Open full question
          </Link>
        </section>
      )}
    </main>
  );
}