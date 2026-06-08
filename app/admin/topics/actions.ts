"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replaceAll(" ", "-")
    .replaceAll(".", "")
    .replaceAll("#", "sharp");
}

export async function createTopic(formData: FormData) {
  const name = formData.get("name") as string;
  const slug = createSlug(name);

  await prisma.topic.create({
    data: {
      name,
      slug,
    },
  });

  revalidatePath("/topics");
  revalidatePath("/admin/topics");
}

export async function deleteTopic(formData: FormData) {
  const id = formData.get("id") as string;

  await prisma.topic.delete({
    where: { id },
  });

  revalidatePath("/topics");
  revalidatePath("/admin/topics");
}

export async function updateTopic(formData: FormData) {
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const slug = createSlug(name);

  await prisma.topic.update({
    where: { id },
    data: {
      name,
      slug,
    },
  });

  revalidatePath("/topics");
  revalidatePath("/admin/topics");
}
