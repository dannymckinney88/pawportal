import {
  getSessionEngagementClasses,
  getSessionEngagementLabel,
  type SessionEngagementStatus,
} from "@/lib/sessions/getSessionEngagementStatus";

type SessionStatusBadgeProps = {
  status: SessionEngagementStatus;
};

export const SessionStatusBadge = ({ status }: SessionStatusBadgeProps) => {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${getSessionEngagementClasses(
        status
      )}`}
    >
      {getSessionEngagementLabel(status)}
    </span>
  );
};
