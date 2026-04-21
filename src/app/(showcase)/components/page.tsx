"use client";

import { useId, useState } from "react";

import { ComponentFrame } from "@/components/chrome/ComponentFrame";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Radio } from "@/components/ui/radio";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useTheme } from "@/lib/useTheme";

export default function ComponentsPage() {
  const { theme } = useTheme();
  const [marketingOptIn, setMarketingOptIn] = useState(true);
  const [contactMethod, setContactMethod] = useState<"email" | "phone">("email");
  const emailId = useId();
  const messageId = useId();

  return (
    <main className="flex-1">
      <header
        data-theme={theme}
        className="w-full bg-(--bhds-color-bg-page) px-6 py-10"
      >
        <div className="mx-auto w-full max-w-[1024px]">
          <h1 className="text-(length:--bhds-font-size-4xl) font-bold leading-(--bhds-line-height-tight) text-(--bhds-color-brand-accent) [font-family:var(--bhds-font-family-sans)]">
            Components
          </h1>
          <p className="mt-(--bhds-space-3) max-w-2xl text-(length:--bhds-font-size-md) leading-(--bhds-line-height-relaxed) text-(--bhds-color-text-secondary) [font-family:var(--bhds-font-family-sans)]">
            A working gallery of BHDS components, shown in the current theme so teams can validate
            behavior and styling as BHDS 1 transitions to BHDS 2.
          </p>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-[min(80rem,calc(100%-1.5rem))] flex-col gap-6 px-3 py-6 sm:px-4 sm:py-8">
        <ComponentFrame
          name="Form Inputs"
          contentClassName="bg-(--bhds-color-bg-page) p-6"
        >
          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex flex-col gap-4">
              <div className="grid gap-1.5">
                <label
                  htmlFor={emailId}
                  className="text-(length:--bhds-font-size-sm) font-semibold text-(--bhds-color-text-primary) [font-family:var(--bhds-font-family-sans)]"
                >
                  Email
                </label>
                <Input id={emailId} placeholder="name@brighthorizons.com" autoComplete="email" />
                <p className="text-xs text-(--bhds-color-text-secondary) [font-family:var(--bhds-font-family-sans)]">
                  Uses shared border + focus-ring tokens.
                </p>
              </div>

              <div className="grid gap-1.5">
                <label className="text-(length:--bhds-font-size-sm) font-semibold text-(--bhds-color-text-primary) [font-family:var(--bhds-font-family-sans)]">
                  Department
                </label>
                <Select defaultValue="">
                  <option value="" disabled>
                    Select one…
                  </option>
                  <option value="design">Design</option>
                  <option value="engineering">Engineering</option>
                  <option value="product">Product</option>
                  <option value="marketing">Marketing</option>
                </Select>
              </div>

              <div className="grid gap-1.5">
                <label
                  htmlFor={messageId}
                  className="text-(length:--bhds-font-size-sm) font-semibold text-(--bhds-color-text-primary) [font-family:var(--bhds-font-family-sans)]"
                >
                  Message
                </label>
                <Textarea id={messageId} placeholder="What are you migrating?" />
              </div>
            </div>

            <div className="flex flex-col gap-5">
              <div className="rounded-[16px] border border-neutral-200/80 bg-(--bhds-color-bg-surface) p-4">
                <h2 className="text-(length:--bhds-font-size-md) font-bold text-(--bhds-color-text-primary) [font-family:var(--bhds-font-family-sans)]">
                  Preferences
                </h2>

                <div className="mt-4 grid gap-3">
                  <label className="flex items-center gap-2 text-(length:--bhds-font-size-sm) text-(--bhds-color-text-primary) [font-family:var(--bhds-font-family-sans)]">
                    <Checkbox
                      checked={marketingOptIn}
                      onChange={(e) => setMarketingOptIn(e.currentTarget.checked)}
                    />
                    Send me migration updates
                  </label>

                  <div className="grid gap-2">
                    <div className="text-(length:--bhds-font-size-sm) font-semibold text-(--bhds-color-text-primary) [font-family:var(--bhds-font-family-sans)]">
                      Preferred contact
                    </div>
                    <label className="flex items-center gap-2 text-(length:--bhds-font-size-sm) text-(--bhds-color-text-primary) [font-family:var(--bhds-font-family-sans)]">
                      <Radio
                        name="contact"
                        checked={contactMethod === "email"}
                        onChange={() => setContactMethod("email")}
                      />
                      Email
                    </label>
                    <label className="flex items-center gap-2 text-(length:--bhds-font-size-sm) text-(--bhds-color-text-primary) [font-family:var(--bhds-font-family-sans)]">
                      <Radio
                        name="contact"
                        checked={contactMethod === "phone"}
                        onChange={() => setContactMethod("phone")}
                      />
                      Phone
                    </label>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <div className="text-(length:--bhds-font-size-sm) text-(--bhds-color-text-primary) [font-family:var(--bhds-font-family-sans)]">
                      Notifications
                    </div>
                    <Switch
                      checked={marketingOptIn}
                      onCheckedChange={setMarketingOptIn}
                      label="Notifications"
                    />
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <Button intent="primary" size="md">
                    Save
                  </Button>
                  <Button intent="secondary" size="md">
                    Cancel
                  </Button>
                </div>
              </div>

              <div className={cn("grid gap-2")}>
                <div className="text-xs font-semibold uppercase tracking-wide text-neutral-600">
                  States
                </div>
                <Input disabled value="Disabled input" readOnly />
                <Input
                  aria-invalid="true"
                  className="border-red-500 focus-visible:outline-red-500"
                  defaultValue="Error input"
                />
              </div>
            </div>
          </div>
        </ComponentFrame>
      </div>
    </main>
  );
}
