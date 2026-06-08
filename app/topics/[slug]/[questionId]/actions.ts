"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const TEST_USER_EMAIL = "test@example.com";

export async function markQuestionCompleted(formData: FormData) {
  const questionId = formData.get("questionId") as string;
  const path = formData.get("path") as string;

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      email: TEST_USER_EMAIL,
    },
  });

  await prisma.userProgress.upsert({
    where: {
      userId_questionId: {
        userId: user.id,
        questionId,
      },
    },
    update: {
      completed: true,
    },
    create: {
      userId: user.id,
      questionId,
      completed: true,
    },
  });

  revalidatePath(path);
}