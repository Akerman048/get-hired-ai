import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

import { markQuestionCompleted } from "./actions";

type Props = {
  params: Promise<{
    slug: string;
    questionId: string;
  }>;
};

export default async function QuestionPage({ params }: Props) {
  const { slug, questionId } = await params;

  const question = await prisma.question.findUnique({
    where: { id: questionId },
    include: { topic: true },
  });

  const user = await prisma.user.findUnique({
  where: {
    email: "test@example.com",
  },
});



  if (!question || question.topic.slug !== slug) {
    notFound();
  }

  const progress = user
  ? await prisma.userProgress.findUnique({
      where: {
        userId_questionId: {
          userId: user.id,
          questionId: question.id,
        },
      },
    })
  : null;

const isCompleted = progress?.completed ?? false;

  return (
    <main className="mx-auto max-w-3xl p-8">
      <p className="mb-2 text-sm text-gray-500">{question.topic.name}</p>

      <h1 className="mb-4 text-4xl font-bold">{question.title}</h1>

      <span className="mb-8 inline-block rounded-full bg-gray-100 px-3 py-1 text-sm">
        {question.level}
      </span>

      <section className="mb-8">
        <h2 className="mb-2 text-xl font-semibold">Short Answer</h2>
        <p>{question.answer}</p>
      </section>

      {question.explanation && (
        <section>
          <h2 className="mb-2 text-xl font-semibold">Explanation</h2>
          <p>{question.explanation}</p>
        </section>
      )}

  <form action={markQuestionCompleted} className="mt-8">
  <input type="hidden" name="questionId" value={question.id} />
  <input
    type="hidden"
    name="path"
    value={`/topics/${question.topic.slug}/${question.id}`}
  />

  <button
    type="submit"
    disabled={isCompleted}
    className="rounded-lg bg-black px-5 py-3 text-white transition hover:opacity-80 disabled:cursor-not-allowed disabled:bg-green-600"
  >
    {isCompleted ? "Completed ✅" : "Mark as completed"}
  </button>
</form>
    </main>
  );
}