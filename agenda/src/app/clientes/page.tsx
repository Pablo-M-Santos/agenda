"use client";

import { useEffect, useState } from "react";
import { MapPin, Pencil, Plus, Search, User, Users } from "lucide-react";

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
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Clientes</h1>

            <p className="text-sm text-gray-500">
              Gerencie os clientes e seus endereços.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="flex items-center justify-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            <Plus className="h-4 w-4" />
            Novo cliente
          </button>
        </div>

        {/* Busca */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar cliente, telefone ou casa..."
            className="w-full rounded-xl border bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-black"
          />
        </div>

        {/* Lista */}
        <div className="rounded-xl border bg-white">
          {loading ? (
            <div className="flex min-h-48 items-center justify-center">
              <p className="text-sm text-gray-500">Carregando clientes...</p>
            </div>
          ) : filteredClients.length === 0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center">
              <Users className="h-10 w-10 text-gray-300" />

              <h2 className="mt-4 font-semibold">
                {search
                  ? "Nenhum cliente encontrado"
                  : "Nenhum cliente cadastrado"}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {search
                  ? "Tente buscar por outro nome ou endereço."
                  : "Cadastre seu primeiro cliente para começar."}
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {filteredClients.map((client) => (
                <div
                  key={client.id}
                  className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100">
                      <User className="h-5 w-5 text-gray-500" />
                    </div>

                    <div className="min-w-0">
                      <h3 className="font-semibold">{client.name}</h3>

                      <p className="mt-1 text-sm text-gray-500">
                        {client.phone}
                      </p>

                      <div className="mt-2 flex items-center gap-1 text-sm text-gray-500">
                        <MapPin className="h-3.5 w-3.5" />
                        {client.condominium} · Casa {client.houseNumber}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium hover:bg-gray-50"
                  >
                    <Pencil className="h-4 w-4" />
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
