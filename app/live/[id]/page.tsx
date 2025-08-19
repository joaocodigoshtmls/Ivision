"use client";

import { useParams, useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import StreamPlayer from "@/components/StreamPlayer";
import { ArrowLeft, Trash2 } from "lucide-react";

export default function LiveViewerPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const cam = useStore((s) => s.cameras.find((x) => x.id === id));
  const remove = useStore((s) => s.removeCamera);

  const handleDelete = () => {
    if (!cam) return;
    if (confirm(`Excluir a conexão "${cam.name}"?`)) {
      remove(cam.id);
      router.push("/live");
    }
  };

  if (!cam) {
    return (
      <main className="space-y-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-sm hover:bg-white/20"
            aria-label="Voltar"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </button>
          <h1 className="text-2xl font-semibold">Câmera não encontrada</h1>
        </div>
      </main>
    );
  }

  return (
    <main className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-sm hover:bg-white/20"
            aria-label="Voltar"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </button>
          <div>
            <h1 className="text-2xl font-semibold">{cam.name}</h1>
            <p className="text-sm text-zinc-400">{cam.location || "Sem localização"}</p>
          </div>
        </div>
        <button
          onClick={handleDelete}
          className="inline-flex items-center gap-2 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300 hover:bg-red-500/20"
          title="Excluir conexão"
        >
          <Trash2 className="h-4 w-4" />
          Excluir
        </button>
      </div>

      <StreamPlayer src={cam.url} className="h-[60vh] w-full rounded-lg bg-black" />
    </main>
  );
}
