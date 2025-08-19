"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { ArrowLeft, Trash2 } from "lucide-react";

export default function LivePage() {
  const cameras = useStore((s) => s.cameras);
  const remove = useStore((s) => s.removeCamera);
  const router = useRouter();

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Excluir a conexão "${name}"?`)) remove(id);
  };

  return (
    <main className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => (history.length > 1 ? router.back() : router.push("/"))}
            className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-sm hover:bg-white/20"
            aria-label="Voltar"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </button>
          <h1 className="text-2xl font-semibold">Ao vivo</h1>
        </div>
        <Link href="/cameras" className="text-sm text-zinc-300 hover:text-white">
          + Cadastrar câmera
        </Link>
      </div>

      {cameras.length === 0 ? (
        <p className="text-zinc-400">
          Nenhuma câmera cadastrada. Vá em <span className="text-white">Câmeras</span> e adicione uma URL (ex: HLS).
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {cameras.map((c) => (
            <div key={c.id} className="rounded-2xl border border-white/10 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{c.name}</h3>
                  <p className="text-xs text-zinc-400">{c.location || "Sem localização"}</p>
                </div>
                <span className="text-xs text-zinc-400">{c.protocol.toUpperCase()}</span>
              </div>
              <div className="flex gap-3">
                <Link
                  href={`/live/${c.id}`}
                  className="rounded-lg bg-white/10 px-3 py-2 text-sm font-medium hover:bg-white/20"
                >
                  Assistir
                </Link>
                <button
                  onClick={() => handleDelete(c.id, c.name)}
                  className="inline-flex items-center gap-2 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300 hover:bg-red-500/20"
                  title="Excluir"
                >
                  <Trash2 className="h-4 w-4" />
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
