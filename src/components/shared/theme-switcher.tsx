"use client";

import { Check, Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const themeOptions = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
] as const;

type ThemeOption = (typeof themeOptions)[number]["value"];

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { setTheme, theme = "system" } = useTheme();
  const activeTheme = themeOptions.some((option) => option.value === theme)
    ? (theme as ThemeOption)
    : "system";
  const ActiveIcon = themeOptions.find((option) => option.value === activeTheme)?.icon ?? Monitor;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="icon" size="icon" aria-label="Theme options" disabled>
        <Monitor className="size-4" aria-hidden="true" />
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button variant="icon" size="icon" aria-label="Theme options">
              <ActiveIcon className="size-4" aria-hidden="true" />
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent>Theme</TooltipContent>
      </Tooltip>
      <DropdownMenuContent align="end">
        {themeOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = option.value === activeTheme;

          return (
            <DropdownMenuItem
              key={option.value}
              onSelect={() => setTheme(option.value)}
              aria-current={isSelected ? "true" : undefined}
              className="gap-2"
            >
              <Icon className="size-4" aria-hidden="true" />
              <span className="flex-1">{option.label}</span>
              {isSelected ? <Check className="size-4" aria-hidden="true" /> : null}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
