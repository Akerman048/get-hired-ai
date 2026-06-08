import Link from "next/link";
import { prisma } from "@/lib/prisma";

const Topics = async () => {
  const topics = await prisma.topic.findMany({
    orderBy: {
      name: "asc",
    },
  });
  return (
    <main>
      <h1>Topics</h1>

      {topics.map((topic) => (
        <Link key={topic.id} href={`/topics/${topic.slug}`}>
          <h2>{topic.name}</h2>
        </Link>
      ))}
    </main>
  );
};

export default Topics;
