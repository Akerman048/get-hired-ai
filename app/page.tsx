import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#041325] px-8  text-[#fff3da]">
      <div className="mx-auto max-w-6xl">
        {/* Hero */}
        <section className="py-4 text-center">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.3em] text-[#fff3da]/60">
            AI Interview Trainer
          </p>

          <h1 className="mb-8 text-6xl font-bold leading-tight">
            Prepare for your
            <br />
            developer interview 🚀
          </h1>

          <p className="mx-auto mb-10 max-w-3xl text-lg text-[#fff3da]/70">
            Practice JavaScript, React, Next.js, TypeScript, Node.js and
            databases with AI feedback, personalized roadmaps and realistic
            interview simulations.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/topics"
              className="rounded-2xl bg-[#fff3da] px-8 py-4 font-semibold text-[#041325] transition hover:scale-[1.03]"
            >
              Start learning →
            </Link>

            <Link
              href="/interview"
              className="rounded-2xl border border-[#fff3da]/20 bg-[#fff3da]/10 px-8 py-4 font-semibold transition hover:bg-[#fff3da]/20"
            >
              Try interview mode
            </Link>
          </div>
        </section>

        {/* Features */}
        <section className="grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-[#fff3da]/10 bg-[#fff3da]/5 p-8 shadow-xl">
            <div className="mb-4 text-4xl">📚</div>

            <h2 className="mb-3 text-2xl font-semibold">
              Question Library
            </h2>

            <p className="text-[#fff3da]/70">
              Learn from structured lessons and questions grouped by topic and
              difficulty.
            </p>
          </div>

          <div className="rounded-3xl border border-[#fff3da]/10 bg-[#fff3da]/5 p-8 shadow-xl">
            <div className="mb-4 text-4xl">📈</div>

            <h2 className="mb-3 text-2xl font-semibold">
              Progress Tracking
            </h2>

            <p className="text-[#fff3da]/70">
              Track completed lessons, identify weak areas and monitor your
              preparation.
            </p>
          </div>

          <div className="rounded-3xl border border-[#fff3da]/10 bg-[#fff3da]/5 p-8 shadow-xl">
            <div className="mb-4 text-4xl">🤖</div>

            <h2 className="mb-3 text-2xl font-semibold">
              AI Interview Mode
            </h2>

            <p className="text-[#fff3da]/70">
              Answer real interview questions and receive detailed AI feedback
              and improvement suggestions.
            </p>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="mt-24 rounded-[2rem] border border-[#fff3da]/10 bg-[#fff3da]/5 p-12 text-center shadow-2xl">
          <h2 className="mb-4 text-4xl font-bold">
            Ready to get hired? 💼
          </h2>

          <p className="mx-auto mb-8 max-w-2xl text-[#fff3da]/70">
            Build confidence, improve your interview skills and prepare with
            personalized AI-generated roadmaps.
          </p>

          <Link
            href="/interview"
            className="inline-block rounded-2xl bg-[#fff3da] px-8 py-4 text-lg font-bold text-[#041325] transition hover:scale-[1.03]"
          >
            Start Interview Training
          </Link>
        </section>
      </div>
    </main>
  );
}