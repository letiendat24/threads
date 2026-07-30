export async function copyTextToClipboard(text: string) {
  if (!navigator.clipboard?.writeText) {
    throw new Error("Clipboard is not available.");
  }

  await navigator.clipboard.writeText(text);
}

export async function sharePostLink(url: string, title = "Threads post") {
  if (navigator.share) {
    await navigator.share({
      title,
      url,
    });
    return "shared" as const;
  }

  await copyTextToClipboard(url);
  return "copied" as const;
}
