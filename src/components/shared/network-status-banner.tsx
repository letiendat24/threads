"use client";

import { WifiOff } from "lucide-react";
import { useEffect, useState } from "react";

export function NetworkStatusBanner() {
  const [mounted, setMounted] = useState(false);
  const [isOnline, setOnline] = useState(true);

  useEffect(() => {
    setMounted(true);
    setOnline(navigator.onLine);

    function handleOnline() {
      setOnline(true);
    }

    function handleOffline() {
      setOnline(false);
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!mounted || isOnline) {
    return null;
  }

  return (
    <div
      className="sticky top-mobile-header z-30 flex items-center justify-center gap-2 border-b border-border bg-warning px-4 py-2 text-center text-body-sm font-medium text-warning-foreground md:top-0"
      role="status"
      aria-live="polite"
    >
      <WifiOff className="size-4" aria-hidden="true" />
      You are offline. Some actions may fail until the connection returns.
    </div>
  );
}
