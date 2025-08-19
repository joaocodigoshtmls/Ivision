"use client";

import { useState } from "react";
import CameraCard, { Camera } from "./cameracard";

export default function CamerasPage() {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [location, setLocation] = useState("");
  const [live, setLive] = useState(true); // << padrão: ao vivo
  const [cameras, setCameras] = useState<Camera[]>([]);

  function addCamera() {
    if (!name || !url) return;
    setCameras(prev => [
      {
        id: crypto.randomUUID(),
        name,
        type: "HLS",
        url,
        location: location || undefined,
        live, // << salva a escolha
      },
      ...prev,
    ]);
    setName("");
    setUrl("");
    setLocation("");
    setLive(true);
  }

  function deleteCamera(id: string) {
    setCameras(prev => prev.filter(c => c.id !== id));
  }

  return (
    <main className="p-6 space-y-6">
      <button
        onClick={() => history.back()}
        className="text-sm px-3 py-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700"
      >
        ← Voltar
      </button>

      <h1 className="text-2xl font-semibold">Câmeras</h1>

      {/* Formulário */}
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-3 items-end">
        <div className="flex flex-col">
          <label className="text-sm text-zinc-400 mb-1">Nome</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="px-3 py-2 rounded-md bg-zinc-900 border border-zinc-800 outline-none"
            placeholder="Ex.: Entrada Principal"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-zinc-400 mb-1">Tipo</label>
          <select
            disabled
            className="px-3 py-2 rounded-md bg-zinc-900 border border-zinc-800 outline-none text-zinc-400"
          >
            <option>HLS</option>
          </select>
        </div>

        <div className="flex flex-col lg:col-span-2">
          <label className="text-sm text-zinc-400 mb-1">URL (.m3u8)</label>
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="px-3 py-2 rounded-md bg-zinc-900 border border-zinc-800 outline-none"
            placeholder="https://.../master.m3u8"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-zinc-400 mb-1">Localização (opcional)</label>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="px-3 py-2 rounded-md bg-zinc-900 border border-zinc-800 outline-none"
            placeholder="Estacionamento, Recepção..."
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            id="live"
            type="checkbox"
            checked={live}
            onChange={(e) => setLive(e.target.checked)}
            className="accent-emerald-600 w-4 h-4"
          />
          <label htmlFor="live" className="text-sm select-none">
            Ao vivo
          </label>
        </div>

        <button
          onClick={addCamera}
          className="px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-700 font-medium"
        >
          Adicionar
        </button>
      </div>

      {/* Lista */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {cameras.length === 0 && (
          <div className="text-sm text-zinc-400">
            Nenhuma câmera adicionada ainda. Informe nome e URL <code>.m3u8</code> acima.
          </div>
        )}
        {cameras.map((cam) => (
          <CameraCard key={cam.id} camera={cam} onDelete={deleteCamera} />
        ))}
      </div>
    </main>
  );
}
