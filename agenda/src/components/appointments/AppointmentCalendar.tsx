"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import type { Appointment } from "@/types/appointment";

interface AppointmentCalendarProps {
  appointments: Appointment[];
  selectedDate: string | null;
  onDateSelect: (date: string) => void;
  currentMonth: Date;
  onMonthChange: (date: Date) => void;
}

export function AppointmentCalendar({
  appointments,
  selectedDate,
  onDateSelect,
  currentMonth,
  onMonthChange,
}: AppointmentCalendarProps) {
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDay = new Date(year, month, 1);

  const lastDay = new Date(year, month + 1, 0);

  /*
   * JavaScript:
   * domingo = 0
   * segunda = 1
   *
   * Como queremos segunda-feira
   * como primeiro dia:
   */
  const startDay = (firstDay.getDay() + 6) % 7;

  const daysInMonth = lastDay.getDate();

  const totalCells = Math.ceil((startDay + daysInMonth) / 7) * 7;

  const days = Array.from({ length: totalCells }, (_, index) => {
    const dayNumber = index - startDay + 1;

    if (dayNumber < 1 || dayNumber > daysInMonth) {
      return null;
    }

    return new Date(year, month, dayNumber);
  });

  function formatDate(date: Date) {
    const dateYear = date.getFullYear();

    const dateMonth = String(date.getMonth() + 1).padStart(2, "0");

    const dateDay = String(date.getDate()).padStart(2, "0");

    return `${dateYear}-${dateMonth}-${dateDay}`;
  }

  function getAppointmentsForDate(date: Date) {
    const formatted = formatDate(date);

    return appointments.filter((appointment) => appointment.date === formatted);
  }

  function goToPreviousMonth() {
    onMonthChange(new Date(year, month - 1, 1));
  }

  function goToNextMonth() {
    onMonthChange(new Date(year, month + 1, 1));
  }

  const monthLabel = new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric",
  }).format(currentMonth);

  return (
    <div className="rounded-xl border bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-4 py-4">
        <button
          type="button"
          onClick={goToPreviousMonth}
          className="rounded-lg p-2 hover:bg-gray-100"
          aria-label="Mês anterior"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <h2 className="text-lg font-semibold capitalize">{monthLabel}</h2>

        <button
          type="button"
          onClick={goToNextMonth}
          className="rounded-lg p-2 hover:bg-gray-100"
          aria-label="Próximo mês"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Semana */}
      <div className="grid grid-cols-7 border-b">
        {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map((day) => (
          <div
            key={day}
            className="p-3 text-center text-xs font-medium text-gray-500"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Dias */}
      <div className="grid grid-cols-7">
        {days.map((date, index) => {
          if (!date) {
            return (
              <div
                key={`empty-${index}`}
                className="min-h-24 border-b border-r bg-gray-50/50"
              />
            );
          }

          const dateString = formatDate(date);

          const dayAppointments = getAppointmentsForDate(date);

          const isSelected = selectedDate === dateString;

          const isToday = formatDate(new Date()) === dateString;

          return (
            <button
              key={dateString}
              type="button"
              onClick={() => onDateSelect(dateString)}
              className={`min-h-24 border-b border-r p-2 text-left transition hover:bg-gray-50 ${
                isSelected ? "bg-gray-100" : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-sm ${
                    isToday ? "bg-black text-white" : "text-gray-700"
                  }`}
                >
                  {date.getDate()}
                </span>

                {dayAppointments.length > 0 && (
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                    {dayAppointments.length}
                  </span>
                )}
              </div>

              <div className="mt-2 space-y-1">
                {dayAppointments.slice(0, 2).map((appointment) => (
                  <div
                    key={appointment.id}
                    className="truncate rounded bg-gray-100 px-1.5 py-1 text-xs text-gray-700"
                  >
                    {appointment.startTime} · {appointment.clientName}
                  </div>
                ))}

                {dayAppointments.length > 2 && (
                  <p className="text-xs text-gray-400">
                    + {dayAppointments.length - 2} atendimento(s)
                  </p>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
