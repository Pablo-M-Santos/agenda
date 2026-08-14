import { CheckCircle2, Circle, XCircle } from "lucide-react";

import type { AppointmentStatus } from "@/types/appointment";

import { getAppointmentStatusLabel } from "@/utils/appointment";

interface AppointmentStatusBadgeProps {
  status: AppointmentStatus;
}

export function AppointmentStatusBadge({
  status,
}: AppointmentStatusBadgeProps) {
  const config = {
    SCHEDULED: {
      icon: Circle,
      className: "bg-amber-50 text-amber-700 border-amber-200",
    },

    COMPLETED: {
      icon: CheckCircle2,
      className: "bg-green-50 text-green-700 border-green-200",
    },

    CANCELLED: {
      icon: XCircle,
      className: "bg-red-50 text-red-700 border-red-200",
    },
  };

  const current = config[status];

  const Icon = current.icon;

  return (
    <span
      className={`
      inline-flex items-center gap-1.5
      rounded-full
      border
      px-2.5 py-1
      text-xs font-medium
      transition
      ${current.className}
    `}
    >
      <Icon className="h-3.5 w-3.5 shrink-0" />

      {getAppointmentStatusLabel(status)}
    </span>
  );
}
