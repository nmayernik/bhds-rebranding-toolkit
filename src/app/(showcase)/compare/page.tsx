import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Theme = "bhds1" | "bhds2";

const intents = ["primary", "secondary"] as const;
const sizes = ["md", "lg"] as const;

function ButtonMatrix({ themeOverride }: { themeOverride: Theme }) {
  return (
    <div className="flex flex-wrap items-start gap-6">
      {intents.map((intent) => (
        <div key={intent} className="flex flex-col gap-2">
          <span className="text-xs uppercase tracking-wider text-neutral-500">{intent}</span>
          <div className="flex flex-col items-start gap-2">
            {sizes.map((size) => (
              <Button key={size} themeOverride={themeOverride} intent={intent} size={size}>
                {intent} / {size}
              </Button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function CardMatrix({ themeOverride }: { themeOverride: Theme }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-wider text-neutral-500">filled</span>
        <Card themeOverride={themeOverride} surface="filled" className="max-w-sm">
          <CardHeader>
            <CardTitle>Trusted Care</CardTitle>
            <CardDescription>
              Evidence-based learning across every age. Filled surface, brand shadow.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Filled card body copy sits on the surface token. Radius and shadow come from the active theme.
            </p>
          </CardContent>
          <CardFooter>
            <Button themeOverride={themeOverride} intent="secondary" size="md">
              Learn more
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-wider text-neutral-500">
          outline {themeOverride === "bhds2" ? "(service tile)" : ""}
        </span>
        <Card themeOverride={themeOverride} surface="outline" className="max-w-sm">
          <CardHeader>
            <CardTitle>Service Tile</CardTitle>
            <CardDescription>
              Border-only treatment. In BHDS 2 this is the primary service-tile pattern.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>No fill, no shadow. Border uses the strong border token.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function ComparePage() {
  return (
    <main className="flex-1 p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold">Compare</h1>
        <p className="mt-2 text-sm text-neutral-600">
          Each column forces its theme via <code>themeOverride</code>, independent of the global toggle.
        </p>
      </header>

      <section aria-labelledby="cmp-button" className="mb-12 flex flex-col gap-4">
        <h2 id="cmp-button" className="text-xl font-semibold">Button</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div data-theme="bhds1" className="rounded-lg border border-neutral-200 p-6 bg-[var(--bhds-color-bg-page)]">
            <h3 className="mb-4 text-sm font-semibold text-neutral-600">BHDS 1</h3>
            <ButtonMatrix themeOverride="bhds1" />
          </div>
          <div data-theme="bhds2" className="rounded-lg border border-neutral-200 p-6 bg-[var(--bhds-color-bg-page)]">
            <h3 className="mb-4 text-sm font-semibold text-neutral-600">BHDS 2</h3>
            <ButtonMatrix themeOverride="bhds2" />
          </div>
        </div>
      </section>

      <section aria-labelledby="cmp-card" className="flex flex-col gap-4">
        <h2 id="cmp-card" className="text-xl font-semibold">Card</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div data-theme="bhds1" className="rounded-lg border border-neutral-200 p-6 bg-[var(--bhds-color-bg-page)]">
            <h3 className="mb-4 text-sm font-semibold text-neutral-600">BHDS 1</h3>
            <CardMatrix themeOverride="bhds1" />
          </div>
          <div data-theme="bhds2" className="rounded-lg border border-neutral-200 p-6 bg-[var(--bhds-color-bg-page)]">
            <h3 className="mb-4 text-sm font-semibold text-neutral-600">BHDS 2</h3>
            <CardMatrix themeOverride="bhds2" />
          </div>
        </div>
      </section>
    </main>
  );
}
