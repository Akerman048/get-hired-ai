import { prisma } from "@/lib/prisma";

export async function GET() {
  const topics = await prisma.topic.findMany();

  return Response.json(topics);
}
