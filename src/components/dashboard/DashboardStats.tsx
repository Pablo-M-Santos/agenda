import { CalendarDays, Clock3, CheckCircle2 } from "lucide-react";

interface DashboardStatsProps {
  today: number;
  nextSevenDays: number;
  completed: number;
}

export function DashboardStats({
  today,
  nextSevenDays,
  completed,
}: DashboardStatsProps) {
  const stats = [
    {
      label: "Hoje",
      value: today,
      description: "atendimentos",
      icon: CalendarDays,
    },
    {
      label: "Próximos 7 dias",
      value: nextSevenDays,
      description: "atendimentos",
      icon: Clock3,
    },
    {
      label: "Concluídos",
      value: completed,
      description: "atendimentos",
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.label}
            className="rounded-2xl border border-white/[0.08] bg-[#0D1117] p-5 shadow-sm transition hover:border-white/[0.12]"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  {stat.label}
                </p>
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-blue-400/15 bg-blue-500/[0.08]">
                <Icon className="h-4 w-4 text-blue-400" />
              </div>
            </div>

            <div className="mt-5 flex items-baseline gap-2">
              <span className="text-3xl font-bold tracking-tight text-white">
                {stat.value}
              </span>

              <span className="text-sm text-slate-600">{stat.description}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
