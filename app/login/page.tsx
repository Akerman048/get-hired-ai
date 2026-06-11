import { loginWithGithubBtn, loginWithGoogleBtn } from "@/app/actions/auth";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#041325] px-6 text-[#fff3da]">
      <div className="w-full max-w-md rounded-[2rem] border border-[#fff3da]/10 bg-[#fff3da]/5 p-4 shadow-2xl">
        <div className="mb-10 text-center">
          <p className="mb-3 text-sm uppercase tracking-[0.3em] text-[#fff3da]/50">
            Welcome back
          </p>

          <h1 className="text-5xl font-bold">
            Login 🚀
          </h1>

          <p className="mt-4 text-[#fff3da]/70">
            Continue to Get Hired and keep preparing for your next developer interview.
          </p>
        </div>

        <div className="space-y-5 flex flex-col gap-3">
          <form action={loginWithGithubBtn}>
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-3 rounded-2xl bg-[#fff3da] px-5 py-4 font-semibold text-[#041325] transition hover:scale-[1.02]"
            >
              <span className="text-xl">🐙</span>
              Continue with GitHub
            </button>
          </form>

          <form action={loginWithGoogleBtn}>
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-3 rounded-2xl border border-[#fff3da]/20 bg-[#fff3da]/10 px-5 py-4 font-semibold text-[#fff3da] transition hover:bg-[#fff3da]/20"
            >
              <span className="text-xl">🌐</span>
              Continue with Google
            </button>
          </form>
        </div>

        <div className="mt-10 border-t border-[#fff3da]/10 pt-6 text-center text-sm text-[#fff3da]/50">
          AI Interview Trainer · Learn · Practice · Get Hired 💼
        </div>
      </div>
    </main>
  );
}