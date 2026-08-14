import type { AppointmentStatus } from "@/types/appointment";

export function getAppointmentStatusLabel(
  status: AppointmentStatus
) {
  const labels: Record<
    AppointmentStatus,
    string
  > = {
    SCHEDULED: "Agendado",
    COMPLETED: "Concluído",
    CANCELLED: "Cancelado",
  };

  return labels[status];
}

export function formatAppointmentDate(
  date: string
) {
  const [year, month, day] = date.split("-");

  return `${day}/${month}/${year}`;
}