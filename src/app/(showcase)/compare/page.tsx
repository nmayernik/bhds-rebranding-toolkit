import { BigCta } from "@/components/sections/BigCta";
import { ValuePropServiceGrid } from "@/components/sections/ValuePropServiceGrid";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Radio } from "@/components/ui/radio";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Logo } from "@/components/ui/logo";
import { cn } from "@/lib/utils";

type Theme = "bhds1" | "bhds2";

const intents = ["primary", "secondary"] as const;

function LogoSwatch({
  label,
  onDark,
  children,
}: {
  label: string;
  onDark?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs uppercase tracking-wider text-neutral-500">{label}</span>
      <div
        className={cn(
          "flex min-h-20 flex-wrap items-center gap-6 rounded-md p-4",
          onDark ? "bg-neutral-900" : "bg-white"
        )}
      >
        {children}
      </div>
    </div>
  );
}

function LogoMatrix({ themeOverride }: { themeOverride: Theme }) {
  return (
    <div className="flex flex-col gap-5">
      <LogoSwatch label="horizontal — blue">
        <Logo themeOverride={themeOverride} variant="horizontal" tone="blue" />
      </LogoSwatch>
      <LogoSwatch label="horizontal — white" onDark>
        <Logo themeOverride={themeOverride} variant="horizontal" tone="white" />
      </LogoSwatch>
      <LogoSwatch label="stacked — blue">
        <Logo themeOverride={themeOverride} variant="stacked" tone="blue" />
      </LogoSwatch>
      <LogoSwatch label="stacked — white" onDark>
        <Logo themeOverride={themeOverride} variant="stacked" tone="white" />
      </LogoSwatch>
      <LogoSwatch label="icon — blue">
        <Logo themeOverride={themeOverride} variant="icon" tone="blue" />
      </LogoSwatch>
      <LogoSwatch label="icon — white" onDark>
        <Logo themeOverride={themeOverride} variant="icon" tone="white" />
      </LogoSwatch>
    </div>
  );
}

function ButtonMatrix({ themeOverride }: { themeOverride: Theme }) {
  return (
    <div className="flex flex-wrap items-start gap-6">
      {intents.map((intent) => (
        <div key={intent} className="flex flex-col gap-2">
          <span className="text-xs uppercase tracking-wider text-neutral-500">{intent}</span>
          <Button themeOverride={themeOverride} intent={intent} size="md">
            {intent === "primary" ? "Primary" : "Secondary"}
          </Button>
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

function InputMatrix({ themeOverride }: { themeOverride: Theme }) {
  const fieldLabelClassName =
    "text-sm font-medium text-neutral-700 [font-family:var(--bhds-font-family-sans)]";

  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-2">
        <div className={fieldLabelClassName}>Text</div>
        <Input themeOverride={themeOverride} placeholder="name@brighthorizons.com" autoComplete="email" />
      </div>

      <div className="grid gap-2">
        <div className={fieldLabelClassName}>Select</div>
        <Select themeOverride={themeOverride} defaultValue="">
          <option value="" disabled>
            Select one…
          </option>
          <option value="design">Design</option>
          <option value="engineering">Engineering</option>
          <option value="product">Product</option>
        </Select>
      </div>

      <div className="grid gap-2">
        <div className={fieldLabelClassName}>Textarea</div>
        <Textarea themeOverride={themeOverride} placeholder="What are you migrating?" />
      </div>

      <div className="grid gap-2">
        <div className={fieldLabelClassName}>Choice</div>
        <label className="flex items-center gap-2 text-sm text-(--bhds-color-text-primary) [font-family:var(--bhds-font-family-sans)]">
          <Checkbox themeOverride={themeOverride} defaultChecked />
          Send me migration updates
        </label>
        <label className="flex items-center gap-2 text-sm text-(--bhds-color-text-primary) [font-family:var(--bhds-font-family-sans)]">
          <Radio themeOverride={themeOverride} name={`contact-${themeOverride}`} defaultChecked />
          Email
        </label>
        <label className="flex items-center gap-2 text-sm text-(--bhds-color-text-primary) [font-family:var(--bhds-font-family-sans)]">
          <Radio themeOverride={themeOverride} name={`contact-${themeOverride}`} />
          Phone
        </label>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="text-sm text-(--bhds-color-text-primary) [font-family:var(--bhds-font-family-sans)]">
          Notifications
        </div>
        <Switch themeOverride={themeOverride} defaultChecked label="Notifications" />
      </div>

      <div className="flex flex-wrap gap-3">
        <Button themeOverride={themeOverride} intent="primary" size="md">
          Save
        </Button>
        <Button themeOverride={themeOverride} intent="secondary" size="md">
          Cancel
        </Button>
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

      <section aria-labelledby="cmp-logo" className="mb-12 flex flex-col gap-4">
        <h2 id="cmp-logo" className="text-xl font-semibold">Logo</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div data-theme="bhds1" className="rounded-lg border border-neutral-200 bg-(--bhds-color-gray-25) p-6">
            <h3 className="mb-4 text-sm font-semibold text-neutral-600">BHDS 1</h3>
            <LogoMatrix themeOverride="bhds1" />
          </div>
          <div data-theme="bhds2" className="rounded-lg border border-neutral-200 bg-(--bhds-color-gray-25) p-6">
            <h3 className="mb-4 text-sm font-semibold text-neutral-600">BHDS 2</h3>
            <LogoMatrix themeOverride="bhds2" />
          </div>
        </div>
      </section>

      <section aria-labelledby="cmp-button" className="mb-12 flex flex-col gap-4">
        <h2 id="cmp-button" className="text-xl font-semibold">Button</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div data-theme="bhds1" className="rounded-lg border border-neutral-200 bg-(--bhds-color-gray-25) p-6">
            <h3 className="mb-4 text-sm font-semibold text-neutral-600">BHDS 1</h3>
            <ButtonMatrix themeOverride="bhds1" />
          </div>
          <div data-theme="bhds2" className="rounded-lg border border-neutral-200 bg-(--bhds-color-gray-25) p-6">
            <h3 className="mb-4 text-sm font-semibold text-neutral-600">BHDS 2</h3>
            <ButtonMatrix themeOverride="bhds2" />
          </div>
        </div>
      </section>

      <section aria-labelledby="cmp-card" className="mb-12 flex flex-col gap-4">
        <h2 id="cmp-card" className="text-xl font-semibold">Card</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div data-theme="bhds1" className="rounded-lg border border-neutral-200 bg-(--bhds-color-gray-25) p-6">
            <h3 className="mb-4 text-sm font-semibold text-neutral-600">BHDS 1</h3>
            <CardMatrix themeOverride="bhds1" />
          </div>
          <div data-theme="bhds2" className="rounded-lg border border-neutral-200 bg-(--bhds-color-gray-25) p-6">
            <h3 className="mb-4 text-sm font-semibold text-neutral-600">BHDS 2</h3>
            <CardMatrix themeOverride="bhds2" />
          </div>
        </div>
      </section>

      <section aria-labelledby="cmp-inputs" className="mb-12 flex flex-col gap-4">
        <h2 id="cmp-inputs" className="text-xl font-semibold">Form Inputs</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div data-theme="bhds1" className="rounded-lg border border-neutral-200 bg-(--bhds-color-gray-25) p-6">
            <h3 className="mb-4 text-sm font-semibold text-neutral-600">BHDS 1</h3>
            <InputMatrix themeOverride="bhds1" />
          </div>
          <div data-theme="bhds2" className="rounded-lg border border-neutral-200 bg-(--bhds-color-gray-25) p-6">
            <h3 className="mb-4 text-sm font-semibold text-neutral-600">BHDS 2</h3>
            <InputMatrix themeOverride="bhds2" />
          </div>
        </div>
      </section>

      <section aria-labelledby="cmp-vpsg" className="mb-12 flex flex-col gap-4">
        <h2 id="cmp-vpsg" className="text-xl font-semibold">Value Prop + Service Grid</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div data-theme="bhds1" className="overflow-hidden rounded-lg border border-neutral-200 bg-(--bhds-color-gray-25)">
            <div className="px-6 pt-4 pb-2"><h3 className="text-sm font-semibold text-neutral-600">BHDS 1</h3></div>
            <ValuePropServiceGrid themeOverride="bhds1" />
          </div>
          <div data-theme="bhds2" className="overflow-hidden rounded-lg border border-neutral-200 bg-(--bhds-color-gray-25)">
            <div className="px-6 pt-4 pb-2"><h3 className="text-sm font-semibold text-neutral-600">BHDS 2</h3></div>
            <ValuePropServiceGrid themeOverride="bhds2" />
          </div>
        </div>
      </section>

      <section aria-labelledby="cmp-bigcta" className="flex flex-col gap-4">
        <h2 id="cmp-bigcta" className="text-xl font-semibold">Big CTA</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div data-theme="bhds1" className="overflow-hidden rounded-lg border border-neutral-200 bg-(--bhds-color-gray-25)">
            <div className="px-6 pt-4 pb-2"><h3 className="text-sm font-semibold text-neutral-600">BHDS 1</h3></div>
            <BigCta themeOverride="bhds1" />
          </div>
          <div data-theme="bhds2" className="overflow-hidden rounded-lg border border-neutral-200 bg-(--bhds-color-gray-25)">
            <div className="px-6 pt-4 pb-2"><h3 className="text-sm font-semibold text-neutral-600">BHDS 2</h3></div>
            <BigCta themeOverride="bhds2" />
          </div>
        </div>
      </section>
    </main>
  );
}
