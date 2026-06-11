import { prisma } from "@/lib/prisma";
import { Level } from "@/generated/prisma/enums";
import { startInterview } from "./actions";

export default async function InterviewPage() {
  const topics = await prisma.topic.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return (
    <main className="min-h-screen bg-[#041325] px-4 py-8 text-[#fff3da]">
      <div className="mx-auto max-w-4xl">
        <section className="mb-8 rounded-3xl border border-[#fff3da]/10 bg-[#fff3da]/5 p-8 shadow-2xl">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.3em] text-[#fff3da]/60">
            Mock interview
          </p>

          <h1 className="text-5xl font-bold tracking-tight">
            Interview Training
          </h1>

          <p className="mt-4 max-w-2xl text-[#fff3da]/70">
            Choose your mode, topics, level, and question count. Your answers
            will be evaluated by AI after the interview.
          </p>
        </section>

        <form
          action={startInterview}
          className="rounded-3xl border border-[#fff3da]/10 bg-[#fff3da]/5 p-6 shadow-xl"
        >
          <div className="mb-6 rounded-2xl border border-[#fff3da]/10 bg-[#041325]/60 p-5">
            <label className="mb-2 block text-sm font-semibold text-[#fff3da]/80">
              Mode
            </label>

            <select
              name="mode"
              className="w-full rounded-xl border border-[#fff3da]/10 bg-[#041325] p-3 text-[#fff3da] outline-none transition focus:border-[#fff3da]/50"
            >
              <option value="PRACTICE">Practice · no pressure</option>
              <option value="REAL">Real interview · 90 sec/question</option>
              <option value="HARD">Hard mode · 60 sec/question</option>
            </select>
          </div>

          <div className="mb-6 rounded-2xl border border-[#fff3da]/10 bg-[#041325]/60 p-5">
            <label className="mb-2 block text-sm font-semibold text-[#fff3da]/80">
              Topics
            </label>

            <p className="mb-4 text-sm text-[#fff3da]/55">
              Leave empty to use all topics.
            </p>

            <div className="grid gap-3 sm:grid-cols-2">
              {topics.map((topic) => (
                <label
                  key={topic.id}
                  className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#fff3da]/10 bg-[#fff3da]/5 p-3 text-sm transition hover:bg-[#fff3da]/10"
                >
                  <input
                    type="checkbox"
                    name="topics"
                    value={topic.slug}
                    className="h-4 w-4 accent-[#fff3da]"
                  />

                  <span>{topic.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="mb-6 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-[#fff3da]/10 bg-[#041325]/60 p-5">
              <label className="mb-2 block text-sm font-semibold text-[#fff3da]/80">
                Level
              </label>

              <select
                name="level"
                className="w-full rounded-xl border border-[#fff3da]/10 bg-[#041325] p-3 text-[#fff3da] outline-none transition focus:border-[#fff3da]/50"
              >
                <option value="">All levels</option>
                <option value={Level.JUNIOR}>Junior</option>
                <option value={Level.MIDDLE}>Middle</option>
                <option value={Level.SENIOR}>Senior</option>
              </select>
            </div>

            <div className="rounded-2xl border border-[#fff3da]/10 bg-[#041325]/60 p-5">
              <label className="mb-2 block text-sm font-semibold text-[#fff3da]/80">
                Number of questions
              </label>

              <select
                name="questionCount"
                defaultValue="5"
                className="w-full rounded-xl border border-[#fff3da]/10 bg-[#041325] p-3 text-[#fff3da] outline-none transition focus:border-[#fff3da]/50"
              >
                <option value="5">5 questions · about 8 minutes</option>
                <option value="10">10 questions · about 15 minutes</option>
                <option value="15">15 questions · about 23 minutes</option>
                <option value="20">20 questions · about 30 minutes</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-2xl bg-[#fff3da] px-6 py-4 text-lg font-bold text-[#041325] shadow-lg transition hover:scale-[1.01] hover:bg-white"
          >
            Start interview →
          </button>
        </form>
      </div>
    </main>
  );
}