"use client";

import { useStore } from "@/lib/store";
import StreamPlayer from "@/components/StreamPlayer";
import { Trash2 } from "lucide-react";

export function CameraList() {
  const cameras = useStore((s) => s.cameras);
  const remove = useStore((s) => s.removeCamera);

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Excluir a conexão "${name}"?`)) remove(id);
  };

  if (cameras.length === 0) {
    return <p className="text-zinc-400">Nenhuma câmera cadastrada ainda.</p>;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {cameras.map((c) => (
        <div key={c.id} className="rounded-2xl border border-white/10 p-4 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-medium">{c.name}</h3>
              <p className="text-xs text-zinc-400">
                {c.location || "Sem localização"} • {c.protocol.toUpperCase()}
              </p>
            </div>
            <button
              onClick={() => handleDelete(c.id, c.name)}
              className="inline-flex items-center gap-2 rounded-lg bg-red-500/10 px-3 py-1.5 text-xs text-red-300 hover:bg-red-500/20"
              title="Excluir"
            >
              <Trash2 className="h-4 w-4" />
              Excluir
            </button>
          </div>

          {c.protocol === "hls" && (
            <StreamPlayer src={c.url} className="h-48 w-full rounded-lg bg-black" />
          )}
        </div>
      ))}
    </div>
  );
}
