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
    <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0D1117] shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-4">
        <button
          type="button"
          onClick={goToPreviousMonth}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-[#080B10] text-slate-500 transition hover:border-white/[0.12] hover:bg-white/[0.03] hover:text-white"
          aria-label="Mês anterior"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <h2 className="text-lg font-semibold capitalize text-white">
          {monthLabel}
        </h2>

        <button
          type="button"
          onClick={goToNextMonth}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-[#080B10] text-slate-500 transition hover:border-white/[0.12] hover:bg-white/[0.03] hover:text-white"
          aria-label="Próximo mês"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Semana */}
      <div className="grid grid-cols-7 border-b border-white/[0.06] bg-[#080B10]">
        {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map((day) => (
          <div
            key={day}
            className="border-r border-white/[0.04] p-3 text-center text-[10px] font-semibold uppercase tracking-widest text-slate-600 last:border-r-0"
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
                className="min-h-24 border-b border-r border-white/[0.05] bg-[#080B10]/50"
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
              className={`
              group
              min-h-24
              border-b border-r
              border-white/[0.05]
              p-2
              text-left
              transition
              hover:bg-white/[0.025]
              ${isSelected ? "bg-blue-500/[0.06]" : ""}
            `}
            >
              {/* Número + quantidade */}
              <div className="flex items-center justify-between">
                <span
                  className={`
                  flex h-7 w-7
                  items-center justify-center
                  rounded-full
                  text-sm
                  transition
                  ${
                    isToday
                      ? "bg-blue-600 font-semibold text-white shadow-lg shadow-blue-600/20"
                      : isSelected
                        ? "bg-blue-500/10 font-medium text-blue-400"
                        : "text-slate-400 group-hover:text-white"
                  }
                `}
                >
                  {date.getDate()}
                </span>

                {dayAppointments.length > 0 && (
                  <span className="rounded-full border border-blue-400/10 bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold text-blue-400">
                    {dayAppointments.length}
                  </span>
                )}
              </div>

              {/* Atendimentos */}
              <div className="mt-2 space-y-1">
                {dayAppointments.slice(0, 2).map((appointment) => (
                  <div
                    key={appointment.id}
                    className="truncate rounded-lg border border-white/[0.05] bg-[#11161E] px-1.5 py-1 text-[11px] text-slate-400 transition group-hover:border-white/[0.08] group-hover:text-slate-300"
                  >
                    <span className="font-medium text-blue-400">
                      {appointment.startTime}
                    </span>

                    <span className="text-slate-600">{" · "}</span>

                    {appointment.clientName}
                  </div>
                ))}

                {dayAppointments.length > 2 && (
                  <p className="px-1 text-[10px] font-medium text-slate-600">
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
