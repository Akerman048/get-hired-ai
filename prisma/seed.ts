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
    { name: "Browser APIs", slug: "browser-apis" },
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

  await prisma.user.upsert({
    where: {
      email: "test@example.com",
    },
    update: {},
    create: {
      email: "test@example.com",
      name: "Test User",
    },
  });

  const scopeLesson = await prisma.lesson.upsert({
    where: {
      topicId_slug: {
        topicId: javascript.id,
        slug: "scope-and-closures",
      },
    },
    update: {
      title: "Scope and closures",
      description: "Understand lexical scope and closures in JavaScript.",
      order: 1,
    },
    create: {
      topicId: javascript.id,
      title: "Scope and closures",
      slug: "scope-and-closures",
      description: "Understand lexical scope and closures in JavaScript.",
      order: 1,
    },
  });

  const closurePart = await prisma.lessonPart.upsert({
    where: { id: "javascript-closures-intro" },
    update: {
      lessonId: scopeLesson.id,
      title: "Introduction to closures",
      content:
        "A closure is created when a function keeps access to variables from its lexical scope after the outer function has returned.",
      order: 1,
    },
    create: {
      id: "javascript-closures-intro",
      lessonId: scopeLesson.id,
      title: "Introduction to closures",
      content:
        "A closure is created when a function keeps access to variables from its lexical scope after the outer function has returned.",
      order: 1,
    },
  });

  await prisma.question.upsert({
    where: { id: "javascript-closure" },
    update: {
      lessonPartId: closurePart.id,
      title: "What is closure?",
      prompt:
        "Explain what a closure is and give one practical example of when you would use it.",
      level: Level.JUNIOR,
      order: 1,
    },
    create: {
      id: "javascript-closure",
      lessonPartId: closurePart.id,
      title: "What is closure?",
      prompt:
        "Explain what a closure is and give one practical example of when you would use it.",
      level: Level.JUNIOR,
      order: 1,
    },
  });

  console.log("Seed completed");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
