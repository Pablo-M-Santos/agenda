"use client";

import { useEffect, useState } from "react";
import {
  Loader2,
  MapPin,
  Pencil,
  Plus,
  Search,
  User,
  Users,
} from "lucide-react";

import { AppLayout } from "@/components/layout/AppLayout";

import { getClients } from "@/services/client.service";

import type { Client } from "@/types/client";

import { ClientModal } from "@/components/clients/ClientModal";

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  async function loadClients() {
    try {
      setLoading(true);

      const data = await getClients();

      setClients(data);
    } catch (error) {
      console.error("Erro ao carregar clientes:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleClientCreated() {
    setModalOpen(false);

    await loadClients();
  }

  useEffect(() => {
    loadClients();
  }, []);

  const filteredClients = clients.filter((client) => {
    const searchValue = search.toLowerCase();

    return (
      client.name.toLowerCase().includes(searchValue) ||
      client.phone.toLowerCase().includes(searchValue) ||
      client.condominium.toLowerCase().includes(searchValue) ||
      client.houseNumber.toLowerCase().includes(searchValue)
    );
  });

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-500/10">
                <Users className="h-4 w-4 text-blue-400" />
              </div>

              <h1 className="text-2xl font-semibold tracking-tight text-white">
                Clientes
              </h1>
            </div>

            <p className="mt-2 text-sm text-slate-400">
              Gerencie seus clientes e endereços.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/10 transition hover:bg-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
          >
            <Plus className="h-4 w-4" />
            Novo cliente
          </button>
        </div>

        {/* Busca */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar cliente, telefone ou casa..."
            className="w-full rounded-xl border border-white/[0.08] bg-[#0D1117] py-3 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 hover:border-white/[0.12] focus:border-blue-500/60 focus:ring-4 focus:ring-blue-500/10"
          />
        </div>

        {/* Lista */}
        <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0D1117]">
          {loading ? (
            <div className="flex min-h-48 items-center justify-center">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                Carregando clientes...
              </div>
            </div>
          ) : filteredClients.length === 0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/[0.08] bg-[#080B10]">
                <Users className="h-5 w-5 text-slate-600" />
              </div>

              <h2 className="mt-4 font-semibold text-white">
                {search
                  ? "Nenhum cliente encontrado"
                  : "Nenhum cliente cadastrado"}
              </h2>

              <p className="mt-1 max-w-sm text-sm text-slate-500">
                {search
                  ? "Tente buscar por outro nome, telefone ou endereço."
                  : "Cadastre seu primeiro cliente para começar."}
              </p>

              {!search && (
                <button
                  type="button"
                  onClick={() => setModalOpen(true)}
                  className="mt-5 flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500"
                >
                  <Plus className="h-4 w-4" />
                  Novo cliente
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-white/[0.06]">
              {filteredClients.map((client) => (
                <div
                  key={client.id}
                  className="group flex flex-col gap-4 p-5 transition hover:bg-white/[0.015] sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 items-start gap-4">
                    {/* Avatar */}
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-[#080B10]">
                      <User className="h-4 w-4 text-slate-500" />
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate font-semibold text-white">
                        {client.name}
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        {client.phone}
                      </p>

                      <div className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
                        <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-600" />

                        <span className="truncate">
                          {client.condominium}
                          {" · Casa "}
                          {client.houseNumber}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Ações */}
                  <button
                    type="button"
                    className="flex items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-[#080B10] px-3 py-2 text-sm font-medium text-slate-400 transition hover:border-white/[0.12] hover:bg-white/[0.03] hover:text-white"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Editar
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ClientModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={handleClientCreated}
      />
    </AppLayout>
  );
}
