import { prisma } from "../lib/prisma";
import { Level } from "../generated/prisma/enums";

async function main() {
  const topics = [
    { name: "JavaScript", slug: "javascript" },
    { name: "React", slug: "react" },
    { name: "Next.js", slug: "nextjs" },
    { name: "TypeScript", slug: "typescript" },
    { name: "HTML", slug: "html" },
    { name: "CSS", slug: "css" },
    { name: "Git", slug: "git" },
    { name: "Node.js", slug: "nodejs" },
    { name: "Express", slug: "express" },
    { name: "PostgreSQL", slug: "postgresql" },
  ];

  for (const topic of topics) {
    await prisma.topic.upsert({
      where: { slug: topic.slug },
      update: {
        name: topic.name,
      },
      create: topic,
    });
  }

  const javascript = await prisma.topic.findUniqueOrThrow({
    where: { slug: "javascript" },
  });

  const user = await prisma.user.upsert({
  where: {
    email: "test@example.com",
  },
  update: {},
  create: {
    email: "test@example.com",
    name: "Test User",
  },
});

  await prisma.question.upsert({
    where: { id: "javascript-closure" },
    update: {
      title: "What is closure?",
      answer:
        "A closure is a function that remembers variables from its outer scope even after that outer function has finished running.",
      explanation:
        "Closures are useful because they allow inner functions to keep access to variables from the scope where they were created. This is commonly used in callbacks, event handlers, factory functions, and private state patterns.",
      level: Level.JUNIOR,
    },
    create: {
      id: "javascript-closure",
      topicId: javascript.id,
      title: "What is closure?",
      answer:
        "A closure is a function that remembers variables from its outer scope even after that outer function has finished running.",
      explanation:
        "Closures are useful because they allow inner functions to keep access to variables from the scope where they were created. This is commonly used in callbacks, event handlers, factory functions, and private state patterns.",
      level: Level.JUNIOR,
    },
  });

  console.log("Seed completed");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });