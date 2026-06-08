import Link from "next/link";
import { prisma } from "@/lib/prisma";

type Props = {
  searchParams: Promise<{
    q?: string;
  }>;
};

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;

  const questions = q
    ? await prisma.question.findMany({
        where: {
          OR: [
            {
              title: {
                contains: q,
                mode: "insensitive",
              },
            },
            {
              answer: {
                contains: q,
                mode: "insensitive",
              },
            },
            {
              explanation: {
                contains: q,
                mode: "insensitive",
              },
            },
          ],
        },
        include: {
          topic: true,
        },
      })
    : [];

  return (
    <main className="mx-auto max-w-4xl p-8">
      <h1 className="mb-8 text-4xl font-bold">Search Questions</h1>

      <form className="mb-8">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search closure, hooks, promises..."
          className="w-full rounded-xl border p-4"
        />
      </form>

      <div className="space-y-4">
        {questions.map((question) => (
          <Link
            key={question.id}
            href={`/topics/${question.topic.slug}/${question.id}`}
            className="block rounded-xl border p-5 shadow-sm transition hover:bg-gray-50"
          >
            <p className="mb-2 text-sm text-gray-500">
              {question.topic.name} · {question.level}
            </p>

            <h2 className="font-semibold">{question.title}</h2>
          </Link>
        ))}
      </div>

      {q && questions.length === 0 && (
        <p className="text-gray-500">No questions found.</p>
      )}
    </main>
  );
}