"use client";

import {
  CalendarDays,
  House,
  LogOut,
  Settings,
  Users,
  X,
  Zap,
} from "lucide-react";

import { signOut } from "firebase/auth";

import { usePathname, useRouter } from "next/navigation";

import { auth } from "@/lib/firebase/auth";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  async function handleLogout() {
    await signOut(auth);

    router.replace("/login");
  }

  function navigate(path: string) {
    router.push(path);
    onClose();
  }

  const navigation = [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: House,
    },
    {
      label: "Agendamentos",
      path: "/agendamentos",
      icon: CalendarDays,
    },
    {
      label: "Clientes",
      path: "/clientes",
      icon: Users,
    },
  ];

  return (
    <>
      {/* Overlay mobile */}
      {open && (
        <button
          type="button"
          aria-label="Fechar menu"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden"
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          flex w-64 flex-col
          border-r border-white/[0.06]
          bg-[#080B10]
          transition-transform duration-200
          md:translate-x-0
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/[0.06] px-5">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-500/10 shadow-[0_0_20px_rgba(37,99,235,0.08)]">
              <Zap className="h-4 w-4 fill-blue-400 text-blue-400" />
            </div>

            <div className="text-left">
              <p className="text-sm font-semibold tracking-wide text-white">
                AGENDA
              </p>

              <p className="text-[10px] text-slate-600">
                Gestão de atendimentos
              </p>
            </div>
          </button>

          {/* Fechar mobile */}
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-white/[0.05] hover:text-white md:hidden"
            aria-label="Fechar menu"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Navegação */}
        <nav className="flex-1 space-y-1 p-4">
          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-widest text-slate-600">
            Menu
          </p>

          {navigation.map((item) => {
            const Icon = item.icon;

            const active =
              pathname === item.path || pathname.startsWith(`${item.path}/`);

            return (
              <button
                key={item.path}
                type="button"
                onClick={() => navigate(item.path)}
                className={`
                    group relative flex w-full
                    items-center gap-3
                    rounded-xl px-3 py-2.5
                    text-sm transition
                    ${
                      active
                        ? "bg-blue-500/[0.10] text-white"
                        : "text-slate-500 hover:bg-white/[0.03] hover:text-slate-200"
                    }
                  `}
              >
                {active && (
                  <span className="absolute left-0 h-5 w-0.5 rounded-full bg-blue-400" />
                )}

                <Icon
                  className={`
                      h-4 w-4
                      ${
                        active
                          ? "text-blue-400"
                          : "text-slate-600 group-hover:text-slate-400"
                      }
                    `}
                />

                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="my-5 border-t border-white/[0.06]" />

          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-widest text-slate-600">
            Sistema
          </p>

          <button
            type="button"
            className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-500 transition hover:bg-white/[0.03] hover:text-slate-200"
          >
            <Settings className="h-4 w-4 text-slate-600 group-hover:text-slate-400" />
            Configurações
          </button>
        </nav>

        {/* Footer */}
        <div className="border-t border-white/[0.06] p-4">
          {/* Perfil */}
          <div className="mb-3 flex items-center gap-3 rounded-xl border border-white/[0.06] bg-[#0D1117] p-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-sm font-semibold text-blue-400">
              P
            </div>

            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-slate-200">
                Minha conta
              </p>

              <p className="truncate text-[11px] text-slate-600">Usuário</p>
            </div>
          </div>

          {/* Logout */}
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-500 transition hover:bg-red-500/[0.06] hover:text-red-400"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </button>
        </div>
      </aside>
    </>
  );
}
