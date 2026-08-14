import {
  CalendarDays,
  Clock3,
  CheckCircle2,
} from "lucide-react";

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
            className="rounded-xl border bg-white p-5"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                {stat.label}
              </p>

              <Icon className="h-5 w-5 text-gray-400" />
            </div>

            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-bold">
                {stat.value}
              </span>

              <span className="text-sm text-gray-500">
                {stat.description}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}