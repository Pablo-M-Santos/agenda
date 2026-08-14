"use client";

import { useEffect, useState } from "react";
import { CalendarDays, Check, Plus, X } from "lucide-react";

import { AppLayout } from "@/components/layout/AppLayout";
import { AppointmentModal } from "@/components/appointments/AppointmentModal";

import { formatAppointmentDate } from "@/utils/appointment";
import { AppointmentStatusBadge } from "@/components/appointments/AppointmentStatusBadge";
import {
  getAppointments,
  updateAppointmentStatus,
} from "@/services/appointment.service";

import type { Appointment } from "@/types/appointment";

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  async function handleStatusChange(
    appointmentId: string,
    status: "COMPLETED" | "CANCELLED",
  ) {
    try {
      setActionLoading(appointmentId);

      await updateAppointmentStatus(appointmentId, status);

      await loadAppointments();
    } catch (error) {
      console.error("Erro ao atualizar agendamento:", error);
    } finally {
      setActionLoading(null);
    }
  }

  async function loadAppointments() {
    try {
      setLoading(true);

      const data = await getAppointments();

      setAppointments(data);
    } catch (error) {
      console.error("Erro ao carregar agendamentos:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAppointments();
  }, []);

  async function handleAppointmentCreated() {
    setModalOpen(false);

    await loadAppointments();
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Agendamentos</h1>

            <p className="text-sm text-gray-500">
              Gerencie seus próximos atendimentos.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="flex items-center justify-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            <Plus className="h-4 w-4" />
            Novo agendamento
          </button>
        </div>

        {/* Lista */}
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

              <h2 className="mt-4 font-semibold">Nenhum agendamento</h2>

              <p className="mt-1 text-sm text-gray-500">
                Seus próximos atendimentos aparecerão aqui.
              </p>

              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="mt-5 flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
              >
                <Plus className="h-4 w-4" />
                Criar primeiro agendamento
              </button>
            </div>
          ) : (
            <div className="divide-y">
              {appointments.map((appointment) => {
                const isLoading = actionLoading === appointment.id;

                const canChangeStatus = appointment.status === "SCHEDULED";

                return (
                  <div key={appointment.id} className="p-5">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="font-semibold text-gray-900">
                            {appointment.clientName}
                          </h3>

                          <AppointmentStatusBadge status={appointment.status} />
                        </div>

                        <p className="mt-2 text-sm text-gray-600">
                          {appointment.condominium} · Casa{" "}
                          {appointment.houseNumber}
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                          {appointment.service}
                        </p>

                        {appointment.notes && (
                          <p className="mt-2 text-sm text-gray-400">
                            {appointment.notes}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col gap-3 lg:items-end">
                        <div className="text-sm">
                          <p className="font-semibold text-gray-900">
                            {formatAppointmentDate(appointment.date)}
                          </p>

                          <p className="text-gray-500">
                            {appointment.startTime}
                          </p>
                        </div>

                        {canChangeStatus && (
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              disabled={isLoading}
                              onClick={() =>
                                handleStatusChange(appointment.id, "COMPLETED")
                              }
                              className="flex items-center gap-2 rounded-lg border border-green-200 px-3 py-2 text-xs font-medium text-green-700 hover:bg-green-50 disabled:opacity-50"
                            >
                              <Check className="h-4 w-4" />
                              Concluir
                            </button>

                            <button
                              type="button"
                              disabled={isLoading}
                              onClick={() =>
                                handleStatusChange(appointment.id, "CANCELLED")
                              }
                              className="flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                            >
                              <X className="h-4 w-4" />
                              Cancelar
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <AppointmentModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={handleAppointmentCreated}
      />
    </AppLayout>
  );
}
