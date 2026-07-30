type RefreshSessionHandler = () => Promise<void>;

let refreshSessionHandler: RefreshSessionHandler | undefined;
let pendingRefresh: Promise<boolean> | null = null;

export function setRefreshSessionHandler(handler: RefreshSessionHandler | undefined) {
  refreshSessionHandler = handler;
}

export async function refreshSession() {
  if (!refreshSessionHandler) {
    return false;
  }

  if (!pendingRefresh) {
    pendingRefresh = refreshSessionHandler()
      .then(() => true)
      .catch(() => false)
      .finally(() => {
        pendingRefresh = null;
      });
  }

  return pendingRefresh;
}
