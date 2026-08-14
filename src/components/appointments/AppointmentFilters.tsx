"use client";

import { Search } from "lucide-react";

export type AppointmentPeriod = "ALL" | "TODAY" | "TOMORROW" | "NEXT_7_DAYS";

interface AppointmentFiltersProps {
  period: AppointmentPeriod;
  condominium: string;
  search: string;

  condominiums: string[];

  onPeriodChange: (period: AppointmentPeriod) => void;

  onCondominiumChange: (condominium: string) => void;

  onSearchChange: (search: string) => void;
}

export function AppointmentFilters({
  period,
  condominium,
  search,
  condominiums,
  onPeriodChange,
  onCondominiumChange,
  onSearchChange,
}: AppointmentFiltersProps) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#0D1117] p-4 shadow-sm">
      <div className="grid gap-5 lg:grid-cols-[1fr_220px_280px]">
        {/* Período */}
        <div>
          <label className="mb-2.5 block text-[11px] font-semibold uppercase tracking-widest text-slate-600">
            Período
          </label>

          <div className="flex flex-wrap gap-2">
            {[
              {
                value: "TODAY",
                label: "Hoje",
              },
              {
                value: "TOMORROW",
                label: "Amanhã",
              },
              {
                value: "NEXT_7_DAYS",
                label: "Próximos 7 dias",
              },
              {
                value: "ALL",
                label: "Todos",
              },
            ].map((option) => {
              const active = period === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() =>
                    onPeriodChange(option.value as AppointmentPeriod)
                  }
                  className={`
                  rounded-xl border px-3 py-2
                  text-sm font-medium
                  transition
                  focus:outline-none
                  focus:ring-4
                  focus:ring-blue-500/10
                  ${
                    active
                      ? "border-blue-500/30 bg-blue-500/10 text-blue-400 shadow-sm shadow-blue-500/5"
                      : "border-white/[0.08] bg-[#080B10] text-slate-500 hover:border-white/[0.12] hover:bg-white/[0.03] hover:text-slate-200"
                  }
                `}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Condomínio */}
        <div>
          <label
            htmlFor="condominium-filter"
            className="mb-2.5 block text-[11px] font-semibold uppercase tracking-widest text-slate-600"
          >
            Condomínio
          </label>

          <select
            id="condominium-filter"
            value={condominium}
            onChange={(event) => onCondominiumChange(event.target.value)}
            className="w-full rounded-xl border border-white/[0.08] bg-[#080B10] px-3 py-2.5 text-sm text-slate-300 outline-none transition hover:border-white/[0.12] focus:border-blue-500/60 focus:ring-4 focus:ring-blue-500/10"
          >
            <option value="">Todos</option>

            {condominiums.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        {/* Busca */}
        <div>
          <label
            htmlFor="appointment-search"
            className="mb-2.5 block text-[11px] font-semibold uppercase tracking-widest text-slate-600"
          >
            Buscar
          </label>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />

            <input
              id="appointment-search"
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Cliente, casa ou serviço..."
              className="w-full rounded-xl border border-white/[0.08] bg-[#080B10] py-2.5 pl-9 pr-3 text-sm text-white outline-none transition placeholder:text-slate-600 hover:border-white/[0.12] focus:border-blue-500/60 focus:ring-4 focus:ring-blue-500/10"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
