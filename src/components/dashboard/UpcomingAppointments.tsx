import { ArrowRight, Clock, MapPin } from "lucide-react";

import type { Appointment } from "@/types/appointment";

import { AppointmentStatusBadge } from "@/components/appointments/AppointmentStatusBadge";

interface Props {
  appointments: Appointment[];
  onViewAll: () => void;
}

export function UpcomingAppointments({ appointments, onViewAll }: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0D1117] shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.06] p-5">
        <div>
          <h2 className="font-semibold text-slate-200">
            Próximos atendimentos
          </h2>

          <p className="mt-1 text-sm text-slate-600">
            Seus próximos compromissos.
          </p>
        </div>

        <button
          type="button"
          onClick={onViewAll}
          className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-blue-400 transition hover:bg-blue-400/[0.08] hover:text-blue-300"
        >
          Ver agenda
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {appointments.length === 0 ? (
        <div className="flex min-h-36 flex-col items-center justify-center p-8 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.06] bg-[#080B10]">
            <Clock className="h-4 w-4 text-slate-600" />
          </div>

          <p className="mt-3 text-sm text-slate-500">
            Nenhum atendimento próximo.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-white/[0.05]">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="p-5 transition hover:bg-white/[0.015]"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  {/* Horário + data + status */}
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="flex items-center gap-1.5 text-sm font-semibold text-white">
                      <Clock className="h-4 w-4 text-blue-400" />

                      {appointment.startTime}
                    </span>

                    <span className="text-sm text-slate-500">
                      {appointment.date}
                    </span>

                    <AppointmentStatusBadge status={appointment.status} />
                  </div>

                  {/* Cliewnte */}
                  <h3 className="mt-2.5 truncate font-semibold text-slate-200">
                    {appointment.clientName}
                  </h3>

                  {/* Local */}
                  <div className="mt-1.5 flex items-center gap-1.5 text-sm text-slate-500">
                    <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-600" />

                    <span className="truncate">
                      {appointment.condominium}
                      {" · Casa "}
                      {appointment.houseNumber}
                    </span>
                  </div>

                  {/* Serviço */}
                  <p className="mt-1.5 text-sm text-slate-500">
                    {appointment.service}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
