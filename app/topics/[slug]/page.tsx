import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function TopicPage({ params }: Props) {
  const { slug } = await params;

  const topic = await prisma.topic.findUnique({
    where: { slug },
    include: {
      questions: true,
    },
  });

  if (!topic) {
    notFound();
  }

  return (
    <main>
      <h1>{topic.name}</h1>

      {topic.questions.map((question) => (
        <Link key={question.id} href={`/topics/${topic.slug}/${question.id}`}>
          <h2>{question.title}</h2>
          <p>{question.level}</p>
        </Link>
      ))}
    </main>
  );
}