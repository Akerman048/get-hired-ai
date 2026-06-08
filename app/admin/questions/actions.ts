"use server";

import { prisma } from "@/lib/prisma";
import { Level } from "@/generated/prisma/enums";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createQuestion(formData: FormData) {
  const topicId = formData.get("topicId") as string;
  const title = formData.get("title") as string;
  const answer = formData.get("answer") as string;
  const explanation = formData.get("explanation") as string;
  const level = formData.get("level") as Level;

  await prisma.question.create({
    data: {
      topicId,
      title,
      answer,
      explanation,
      level,
    },
  });

  revalidatePath("/topics");
  revalidatePath("/admin/questions");
}

export async function deleteQuestion(formData: FormData) {
  const id = formData.get("id") as string;

  await prisma.question.delete({
    where: { id },
  });

  revalidatePath("/topics");
  revalidatePath("/admin/questions");
}

export async function updateQuestion(formData: FormData) {
  const id = formData.get("id") as string;
  const topicId = formData.get("topicId") as string;
  const title = formData.get("title") as string;
  const answer = formData.get("answer") as string;
  const explanation = formData.get("explanation") as string;
  const level = formData.get("level") as Level;

  await prisma.question.update({
    where: { id },
    data: {
      topicId,
      title,
      answer,
      explanation,
      level,
    },
  });

  revalidatePath("/topics");
  revalidatePath("/admin/questions");

  redirect("/admin/questions");
}
