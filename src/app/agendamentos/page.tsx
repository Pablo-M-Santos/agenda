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

import type { AppointmentPeriod } from "@/components/appointments/AppointmentFilters";

import { AppointmentFilters } from "@/components/appointments/AppointmentFilters";

import { addDays, dateToString, getTodayString } from "@/utils/appointment";

import type { Appointment } from "@/types/appointment";

import { AppointmentCalendar } from "@/components/appointments/AppointmentCalendar";

import { SelectedDateAppointments } from "@/components/appointments/SelectedDateAppointments";
export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const [period, setPeriod] = useState<AppointmentPeriod>("NEXT_7_DAYS");

  const [condominium, setCondominium] = useState("");

  const [search, setSearch] = useState("");

  const [calendarMonth, setCalendarMonth] = useState(new Date());

  const [selectedDate, setSelectedDate] = useState<string>(getTodayString());
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

  const condominiums = Array.from(
    new Set(appointments.map((appointment) => appointment.condominium)),
  ).sort();

  const filteredAppointments = appointments.filter((appointment) => {
    const today = getTodayString();

    const tomorrow = dateToString(addDays(new Date(), 1));

    const nextSevenDays = dateToString(addDays(new Date(), 7));

    let matchesPeriod = true;

    if (period === "TODAY") {
      matchesPeriod = appointment.date === today;
    }

    if (period === "TOMORROW") {
      matchesPeriod = appointment.date === tomorrow;
    }

    if (period === "NEXT_7_DAYS") {
      matchesPeriod =
        appointment.date >= today && appointment.date <= nextSevenDays;
    }

    const matchesCondominium =
      !condominium || appointment.condominium === condominium;

    const searchValue = search.toLowerCase().trim();

    const matchesSearch =
      !searchValue ||
      appointment.clientName.toLowerCase().includes(searchValue) ||
      appointment.houseNumber.toLowerCase().includes(searchValue) ||
      appointment.service.toLowerCase().includes(searchValue);

    return matchesPeriod && matchesCondominium && matchesSearch;
  });

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
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-500/10">
                <CalendarDays className="h-4 w-4 text-blue-400" />
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-white">
                Agendamentos
              </h1>
            </div>

            <p className="mt-2 text-sm text-slate-500">
              Gerencie seus próximos atendimentos.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/10 transition hover:bg-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
          >
            <Plus className="h-4 w-4" />
            Novo agendamento
          </button>
        </div>

        {/* Filtros */}
        <AppointmentFilters
          period={period}
          condominium={condominium}
          search={search}
          condominiums={condominiums}
          onPeriodChange={setPeriod}
          onCondominiumChange={setCondominium}
          onSearchChange={setSearch}
        />

        {/* Calendário */}
        <AppointmentCalendar
          appointments={filteredAppointments}
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
          currentMonth={calendarMonth}
          onMonthChange={setCalendarMonth}
        />

        {/* Agenda do dia */}
        <SelectedDateAppointments
          date={selectedDate}
          appointments={filteredAppointments}
        />

        {/* Lista */}
        <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0D1117] shadow-sm">
          {loading ? (
            <div className="flex min-h-48 items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-500/20 border-t-blue-400" />

                <p className="text-sm text-slate-600">
                  Carregando agendamentos...
                </p>
              </div>
            </div>
          ) : filteredAppointments.length === 0 ? (
            /* Estado vazio */
            <div className="flex min-h-64 flex-col items-center justify-center px-6 py-10 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/[0.06] bg-[#080B10]">
                <CalendarDays className="h-5 w-5 text-slate-600" />
              </div>

              <h2 className="mt-4 font-semibold text-slate-200">
                {appointments.length === 0
                  ? "Nenhum agendamento"
                  : "Nenhum agendamento encontrado"}
              </h2>

              <p className="mt-1 max-w-sm text-sm text-slate-600">
                {appointments.length === 0
                  ? "Crie seu primeiro atendimento para começar a organizar sua agenda."
                  : "Tente alterar os filtros para encontrar outros atendimentos."}
              </p>

              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="mt-5 flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/10 transition hover:bg-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
              >
                <Plus className="h-4 w-4" />

                {appointments.length === 0
                  ? "Criar primeiro agendamento"
                  : "Novo agendamento"}
              </button>
            </div>
          ) : (
            /* Lista */
            <div className="divide-y divide-white/[0.05]">
              {filteredAppointments.map((appointment) => {
                const isLoading = actionLoading === appointment.id;

                const canChangeStatus = appointment.status === "SCHEDULED";

                return (
                  <div
                    key={appointment.id}
                    className="p-5 transition hover:bg-white/[0.015]"
                  >
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                      {/* Informações */}
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="font-semibold text-slate-200">
                            {appointment.clientName}
                          </h3>

                          <AppointmentStatusBadge status={appointment.status} />
                        </div>

                        <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
                          <span className="text-slate-600">
                            {appointment.condominium}
                          </span>

                          <span className="text-slate-700">·</span>

                          <span>Casa {appointment.houseNumber}</span>
                        </p>

                        <p className="mt-1 text-sm text-slate-400">
                          {appointment.service}
                        </p>

                        {appointment.notes && (
                          <p className="mt-2 max-w-2xl text-sm text-slate-600">
                            {appointment.notes}
                          </p>
                        )}
                      </div>

                      {/* Data / ações */}
                      <div className="flex flex-col gap-3 lg:items-end">
                        <div className="flex items-center gap-2 lg:text-right">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.06] bg-[#080B10] lg:hidden">
                            <CalendarDays className="h-4 w-4 text-blue-400" />
                          </div>

                          <div>
                            <p className="text-sm font-semibold text-slate-200">
                              {formatAppointmentDate(appointment.date)}
                            </p>

                            <p className="mt-0.5 text-sm text-blue-400">
                              {appointment.startTime}
                            </p>
                          </div>
                        </div>

                        {canChangeStatus && (
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              disabled={isLoading}
                              onClick={() =>
                                handleStatusChange(appointment.id, "COMPLETED")
                              }
                              className="flex items-center gap-2 rounded-xl border border-emerald-400/15 bg-emerald-400/[0.05] px-3 py-2 text-xs font-medium text-emerald-400 transition hover:border-emerald-400/25 hover:bg-emerald-400/10 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <Check className="h-3.5 w-3.5" />
                              Concluir
                            </button>

                            <button
                              type="button"
                              disabled={isLoading}
                              onClick={() =>
                                handleStatusChange(appointment.id, "CANCELLED")
                              }
                              className="flex items-center gap-2 rounded-xl border border-red-400/15 bg-red-400/[0.05] px-3 py-2 text-xs font-medium text-red-400 transition hover:border-red-400/25 hover:bg-red-400/10 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <X className="h-3.5 w-3.5" />
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
