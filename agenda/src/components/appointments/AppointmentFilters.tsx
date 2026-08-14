"use client";

import { Search } from "lucide-react";

export type AppointmentPeriod =
  | "ALL"
  | "TODAY"
  | "TOMORROW"
  | "NEXT_7_DAYS";

interface AppointmentFiltersProps {
  period: AppointmentPeriod;
  condominium: string;
  search: string;

  condominiums: string[];

  onPeriodChange: (
    period: AppointmentPeriod
  ) => void;

  onCondominiumChange: (
    condominium: string
  ) => void;

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
    <div className="rounded-xl border bg-white p-4">
      <div className="grid gap-4 lg:grid-cols-[1fr_220px_280px]">
        {/* Período */}
        <div>
          <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-gray-500">
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
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() =>
                  onPeriodChange(
                    option.value as AppointmentPeriod
                  )
                }
                className={`rounded-lg border px-3 py-2 text-sm transition ${
                  period === option.value
                    ? "border-black bg-black text-white"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Condomínio */}
        <div>
          <label
            htmlFor="condominium-filter"
            className="mb-2 block text-xs font-medium uppercase tracking-wide text-gray-500"
          >
            Condomínio
          </label>

          <select
            id="condominium-filter"
            value={condominium}
            onChange={(event) =>
              onCondominiumChange(
                event.target.value
              )
            }
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-black"
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
            className="mb-2 block text-xs font-medium uppercase tracking-wide text-gray-500"
          >
            Buscar
          </label>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

            <input
              id="appointment-search"
              value={search}
              onChange={(event) =>
                onSearchChange(event.target.value)
              }
              placeholder="Cliente, casa ou serviço..."
              className="w-full rounded-lg border border-gray-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-black"
            />
          </div>
        </div>
      </div>
    </div>
  );
}