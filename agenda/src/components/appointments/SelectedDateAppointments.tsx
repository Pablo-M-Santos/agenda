"use client";

import {
  CalendarDays,
  Clock,
  MapPin,
} from "lucide-react";

import type { Appointment } from "@/types/appointment";

import {
  AppointmentStatusBadge,
} from "./AppointmentStatusBadge";

interface Props {
  date: string | null;
  appointments: Appointment[];
}

export function SelectedDateAppointments({
  date,
  appointments,
}: Props) {
  if (!date) {
    return (
      <div className="rounded-xl border bg-white p-8 text-center">
        <CalendarDays className="mx-auto h-8 w-8 text-gray-300" />

        <p className="mt-3 text-sm text-gray-500">
          Selecione um dia para visualizar os
          atendimentos.
        </p>
      </div>
    );
  }

  const [year, month, day] =
    date.split("-");

  const formattedDate =
    new Intl.DateTimeFormat(
      "pt-BR",
      {
        weekday: "long",
        day: "2-digit",
        month: "long",
      }
    ).format(
      new Date(
        Number(year),
        Number(month) - 1,
        Number(day)
      )
    );

  const dayAppointments =
    appointments
      .filter(
        (appointment) =>
          appointment.date === date
      )
      .sort((a, b) =>
        a.startTime.localeCompare(
          b.startTime
        )
      );

  return (
    <div className="rounded-xl border bg-white">
      <div className="border-b p-5">
        <p className="text-sm text-gray-500">
          Agenda do dia
        </p>

        <h2 className="mt-1 text-lg font-semibold capitalize">
          {formattedDate}
        </h2>
      </div>

      {dayAppointments.length === 0 ? (
        <div className="p-8 text-center">
          <p className="text-sm text-gray-500">
            Nenhum atendimento agendado
            para este dia.
          </p>
        </div>
      ) : (
        <div className="divide-y">
          {dayAppointments.map(
            (appointment) => (
              <div
                key={appointment.id}
                className="p-5"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="flex items-center gap-1.5 text-sm font-semibold">
                        <Clock className="h-4 w-4 text-gray-400" />

                        {appointment.startTime}
                      </span>

                      <AppointmentStatusBadge
                        status={
                          appointment.status
                        }
                      />
                    </div>

                    <h3 className="mt-2 font-semibold">
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