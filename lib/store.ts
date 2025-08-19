import { create } from "zustand";

export type Camera = {
  id: string;
  name: string;
  protocol: "hls" | "webrtc" | "rtsp";
  url: string;
  location?: string;
};

type Store = {
  cameras: Camera[];
  addCamera: (cam: Camera) => void;
  updateCamera: (id: string, patch: Partial<Camera>) => void;
  removeCamera: (id: string) => void; // <- novo
};

export const useStore = create<Store>((set) => ({
  cameras: [],
  addCamera: (cam) => set((s) => ({ cameras: [cam, ...s.cameras] })),
  updateCamera: (id, patch) =>
    set((s) => ({
      cameras: s.cameras.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    })),
  removeCamera: (id) =>
    set((s) => ({ cameras: s.cameras.filter((c) => c.id !== id) })), // <- novo
}));
