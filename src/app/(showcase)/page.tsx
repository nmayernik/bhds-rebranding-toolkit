export default function TourLandingPage() {
  return (
    <main className="flex-1 p-8">
      <h1 className="text-3xl font-semibold">BHDS Showcase</h1>
      <p className="mt-2 text-sm text-neutral-600">
        Tour the current and next design systems. Use the theme toggle in the header to switch.
      </p>
      <ul className="mt-6 flex flex-col gap-2 text-sm">
        <li><a className="underline" href="/tokens">Tokens</a></li>
        <li><a className="underline" href="/components">Components</a></li>
        <li><a className="underline" href="/compare">Compare</a></li>
      </ul>
    </main>
  );
}
