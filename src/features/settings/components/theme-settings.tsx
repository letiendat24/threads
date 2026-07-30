"use client";

import { Check, Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

const themeOptions = [
  { value: "light", label: "Light", description: "Always use the light theme.", icon: Sun },
  { value: "dark", label: "Dark", description: "Always use the dark theme.", icon: Moon },
  { value: "system", label: "System", description: "Match this device.", icon: Monitor },
] as const;

type ThemeOption = (typeof themeOptions)[number]["value"];

function normalizeTheme(theme: string | undefined): ThemeOption {
  return themeOptions.some((option) => option.value === theme) ? (theme as ThemeOption) : "system";
}

export function ThemeSettings() {
  const [mounted, setMounted] = useState(false);
  const { setTheme, theme = "system" } = useTheme();
  const activeTheme = normalizeTheme(theme);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <fieldset className="space-y-3" aria-label="Theme preference" disabled={!mounted}>
      <legend className="sr-only">Theme preference</legend>
      <div className="grid gap-2 sm:grid-cols-3">
        {themeOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = option.value === activeTheme;

          return (
            <label
              key={option.value}
              className={cn(
                "flex cursor-pointer items-start gap-3 rounded-lg border border-border bg-background p-3 transition-colors hover:bg-surface-hover",
                isSelected && "border-foreground bg-surface-active",
                !mounted && "cursor-not-allowed opacity-60",
              )}
            >
              <input
                type="radio"
                name="theme"
                value={option.value}
                checked={isSelected}
                disabled={!mounted}
                className="mt-1 size-4 accent-current"
                onChange={() => setTheme(option.value)}
              />
              <Icon className="mt-0.5 size-4 shrink-0 text-foreground" aria-hidden="true" />
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2 text-body-sm font-semibold text-foreground">
                  {option.label}
                  {isSelected ? <Check className="size-4" aria-hidden="true" /> : null}
                </span>
                <span className="mt-1 block text-metadata text-muted-foreground">{option.description}</span>
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
