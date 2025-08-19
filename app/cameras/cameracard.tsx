"use client";

import HlsPlayer from "@/components/HlsPlayer";
import { Trash2 } from "lucide-react";
import { useState } from "react";

export type Camera = {
  id: string;
  name: string;
  type: "HLS";
  url: string;
  location?: string;
  live: boolean; // usado para bloquear scrub (forceLive), a badge é detectada pelo player
};

export default function CameraCard({
  camera,
  onDelete,
}: {
  camera: Camera;
  onDelete?: (id: string) => void;
}) {
  const [confirming, setConfirming] = useState(false);

  return (
    <div className="rounded-xl bg-zinc-900/60 border border-zinc-800 p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="font-medium">{camera.name}</div>
        <button
          onClick={() => (confirming ? onDelete?.(camera.id) : setConfirming(true))}
          className={`px-2 py-1 rounded-md text-sm ${
            confirming ? "bg-red-600 hover:bg-red-700" : "bg-zinc-800 hover:bg-zinc-700"
          }`}
          title={confirming ? "Confirmar exclusão" : "Excluir"}
        >
          <div className="flex items-center gap-1">
            <Trash2 size={16} />
            {confirming ? "Confirmar" : "Excluir"}
          </div>
        </button>
      </div>

      <div className="text-xs text-zinc-400 mb-2">
        {camera.location || "Sem localização"} • {camera.type}
      </div>

      <div className="aspect-video bg-black/40 rounded-lg overflow-hidden">
        <HlsPlayer
          src={camera.url}
          forceLive={camera.live}   // bloqueia scrub quando marcado como “ao vivo”
          autoPlay
          muted
          controls
          className="h-full w-full"
        />
      </div>
    </div>
  );
}
