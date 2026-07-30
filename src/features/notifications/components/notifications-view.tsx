import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";

export function NotificationsView() {
  return (
    <>
      <PageHeader title="Activity" description="Notifications and requests" />
      <div className="p-4">
        <EmptyState
          title="Notifications need API support"
          description="Notification list, unread count, and mark-as-read endpoints are not documented in the Hoppscotch collection."
        />
      </div>
    </>
  );
}
