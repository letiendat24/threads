"use client";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useUiStore } from "@/stores/ui-store";

export function ComposerButton() {
  const openComposer = useUiStore((state) => state.openComposer);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="icon" size="icon" aria-label="Create post" onClick={() => openComposer("post")}>
          <Plus className="size-5" aria-hidden="true" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Create</TooltipContent>
    </Tooltip>
  );
}
