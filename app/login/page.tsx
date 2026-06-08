import { loginWithGithubBtn, loginWithGoogleBtn } from "@/app/actions/auth";

export default function LoginPage() {
  return (
    <main className="mx-auto max-w-md p-8">
      <h1 className="mb-6 text-4xl font-bold">Login</h1>

      <div className="space-y-4">
        <form action={loginWithGithubBtn}>
          <button
            type="submit"
            className="w-full rounded-lg bg-black px-5 py-3 text-white"
          >
            Continue with GitHub
          </button>
        </form>

        <form action={loginWithGoogleBtn}>
          <button type="submit" className="w-full rounded-lg border px-5 py-3">
            Continue with Google
          </button>
        </form>
      </div>
    </main>
  );
}
