type UnlockSearchParams = { next?: string; error?: string };

export default async function UnlockPage({
  searchParams,
}: {
  searchParams: Promise<UnlockSearchParams>;
}) {
  const { next, error } = await searchParams;

  return (
    <main className="flex flex-1 items-center justify-center p-8">
      <form
        method="POST"
        action="/api/unlock"
        className="w-full max-w-sm flex flex-col gap-4 p-6 rounded-lg border border-neutral-200 bg-white"
      >
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold">BHDS Showcase</h1>
          <p className="text-sm text-neutral-600">Enter the shared password to continue.</p>
        </div>

        <input type="hidden" name="next" value={next ?? "/"} />

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Password</span>
          <input
            type="password"
            name="password"
            autoFocus
            required
            className="h-10 rounded-md border border-neutral-300 px-3 text-sm outline-none focus:ring-2 focus:ring-neutral-900"
          />
        </label>

        {error && (
          <p className="text-sm text-red-600" role="alert">
            Incorrect password. Try again.
          </p>
        )}

        <button
          type="submit"
          className="h-10 rounded-md bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-800"
        >
          Unlock
        </button>
      </form>
    </main>
  );
}
