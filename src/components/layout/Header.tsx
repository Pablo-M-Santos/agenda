"use client";

import {
  Menu,
  UserCircle,
} from "lucide-react";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({
  onMenuClick,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-white/[0.06] bg-[#05070A]/90 px-4 backdrop-blur-xl md:px-6">
      {/* Mobile */}
      <button
        type="button"
        onClick={onMenuClick}
        className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-[#0D1117] text-slate-400 transition hover:bg-white/[0.05] hover:text-white md:hidden"
        aria-label="Abrir menu"
      >
        <Menu className="h-4 w-4" />
      </button>

      {/* Desktop */}
      <div className="hidden md:block">
        <p className="text-sm font-medium text-slate-300">
          Organização dos seus atendimentos
        </p>
      </div>

      {/* Logo mobile */}
      <div className="absolute left-1/2 flex -translate-x-1/2 items-center gap-2 md:hidden">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600/10">
          <span className="text-sm text-blue-400">
            ⚡
          </span>
        </div>

        <span className="text-sm font-semibold tracking-wide text-white">
          AGENDA
        </span>
      </div>

      {/* User */}
      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-xs font-medium text-slate-300">
            Usuário
          </p>

          <p className="text-[11px] text-slate-600">
            Minha conta
          </p>
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-[#0D1117]">
          <UserCircle className="h-4 w-4 text-slate-500" />
        </div>
      </div>
    </header>
  );
}