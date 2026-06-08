import { prisma } from "@/lib/prisma";
import { updateTopic } from "../../actions";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditTopicPage({ params }: Props) {
  const { id } = await params;

  const topic = await prisma.topic.findUnique({
    where: { id },
  });

  if (!topic) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="mb-8 text-4xl font-bold">Edit Topic</h1>

      <form action={updateTopic} className="rounded-xl border p-6 shadow-sm">
        <input type="hidden" name="id" value={topic.id} />

        <div className="mb-6">
          <label className="mb-2 block font-medium">Topic name</label>

          <input
            name="name"
            required
            defaultValue={topic.name}
            className="w-full rounded-lg border p-3"
          />
        </div>

        <button
          type="submit"
          className="rounded-lg bg-black px-5 py-3 text-white transition hover:opacity-80"
        >
          Save Changes
        </button>
      </form>
    </main>
  );
}