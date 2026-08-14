import {
  ArrowRight,
  Clock,
  MapPin,
} from "lucide-react";

import type { Appointment } from "@/types/appointment";

import {
  AppointmentStatusBadge,
} from "@/components/appointments/AppointmentStatusBadge";

interface Props {
  appointments: Appointment[];
  onViewAll: () => void;
}

export function UpcomingAppointments({
  appointments,
  onViewAll,
}: Props) {
  return (
    <div className="rounded-xl border bg-white">
      <div className="flex items-center justify-between border-b p-5">
        <div>
          <h2 className="font-semibold">
            Próximos atendimentos
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Seus próximos compromissos.
          </p>
        </div>

        <button
          type="button"
          onClick={onViewAll}
          className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-black"
        >
          Ver agenda

          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {appointments.length === 0 ? (
        <div className="p-8 text-center">
          <p className="text-sm text-gray-500">
            Nenhum atendimento próximo.
          </p>
        </div>
      ) : (
        <div className="divide-y">
          {appointments.map(
            (appointment) => (
              <div
                key={appointment.id}
                className="p-5"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="flex items-center gap-1.5 text-sm font-semibold">
                        <Clock className="h-4 w-4 text-gray-400" />

                        {appointment.startTime}
                      </span>

                      <span className="text-sm text-gray-500">
                        {appointment.date}
                      </span>

                      <AppointmentStatusBadge
                        status={
                          appointment.status
                        }
                      />
                    </div>

                    <h3 className="mt-2 font-medium">
                      {appointment.clientName}
                    </h3>

                    <div className="mt-1 flex items-center gap-1.5 text-sm text-gray-500">
                      <MapPin className="h-4 w-4" />

                      {appointment.condominium}
                      {" · Casa "}
                      {appointment.houseNumber}
                    </div>

                    <p className="mt-1 text-sm text-gray-500">
                      {appointment.service}
                    </p>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}