"use client";

import { useEffect, useState } from "react";
import { Plus, CalendarDays } from "lucide-react";

import { AppLayout } from "@/components/layout/AppLayout";
import { getAppointments } from "@/services/appointment.service";

import type { Appointment } from "@/types/appointment";

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<
    Appointment[]
  >([]);

  const [loading, setLoading] = useState(true);

  async function loadAppointments() {
    try {
      const data = await getAppointments();

      setAppointments(data);
    } catch (error) {
      console.error(
        "Erro ao carregar agendamentos:",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAppointments();
  }, []);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              Agendamentos
            </h1>

            <p className="text-sm text-gray-500">
              Gerencie seus próximos atendimentos.
            </p>
          </div>

          <button className="flex items-center justify-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800">
            <Plus className="h-4 w-4" />

            Novo agendamento
          </button>
        </div>

        <div className="rounded-xl border bg-white">
          {loading ? (
            <div className="flex min-h-48 items-center justify-center">
              <p className="text-sm text-gray-500">
                Carregando agendamentos...
              </p>
            </div>
          ) : appointments.length === 0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center">
              <CalendarDays className="h-10 w-10 text-gray-300" />

              <h2 className="mt-4 font-semibold">
                Nenhum agendamento
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Seus próximos atendimentos aparecerão aqui.
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {appointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="p-5"
                >
                  <p className="font-medium">
                    {appointment.clientName}
                  </p>

                  <p className="text-sm text-gray-500">
                    {appointment.date} às{" "}
                    {appointment.startTime}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}