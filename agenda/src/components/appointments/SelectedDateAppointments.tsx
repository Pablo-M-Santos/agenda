"use client";

import { CalendarDays, Clock, MapPin } from "lucide-react";

import type { Appointment } from "@/types/appointment";

import { AppointmentStatusBadge } from "./AppointmentStatusBadge";

interface Props {
  date: string | null;
  appointments: Appointment[];
}

export function SelectedDateAppointments({ date, appointments }: Props) {
  if (!date) {
    return (
      <div className="rounded-xl border bg-white p-8 text-center">
        <CalendarDays className="mx-auto h-8 w-8 text-gray-300" />

        <p className="mt-3 text-sm text-gray-500">
          Selecione um dia para visualizar os atendimentos.
        </p>
      </div>
    );
  }

  const [year, month, day] = date.split("-");

  const formattedDate = new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  }).format(new Date(Number(year), Number(month) - 1, Number(day)));

  const dayAppointments = appointments
    .filter((appointment) => appointment.date === date)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0D1117] shadow-sm">
      {/* Header */}
      <div className="border-b border-white/[0.06] px-5 py-4">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-600">
          Agenda do dia
        </p>

        <h2 className="mt-1.5 text-lg font-semibold capitalize text-white">
          {formattedDate}
        </h2>
      </div>

      {dayAppointments.length === 0 ? (
        /* Estado vazio */
        <div className="flex min-h-48 flex-col items-center justify-center px-6 py-8 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.06] bg-[#080B10]">
            <Clock className="h-4 w-4 text-slate-600" />
          </div>

          <p className="mt-4 text-sm font-medium text-slate-400">
            Nenhum atendimento agendado
          </p>

          <p className="mt-1 text-xs text-slate-600">
            Não existem atendimentos para este dia.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-white/[0.05]">
          {dayAppointments.map((appointment) => (
            <div
              key={appointment.id}
              className="p-5 transition hover:bg-white/[0.015]"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  {/* Horário + status */}
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="flex items-center gap-1.5 text-sm font-semibold text-white">
                      <Clock className="h-4 w-4 text-blue-400" />

                      {appointment.startTime}
                    </span>

                    <AppointmentStatusBadge status={appointment.status} />
                  </div>

                  {/* Cliente */}
                  <h3 className="mt-2.5 truncate text-sm font-semibold text-slate-200">
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
