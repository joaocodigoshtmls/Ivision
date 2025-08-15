import { create } from "zustand";
export type Camera = { id:string; name:string; protocol:"rtsp"|"webrtc"|"hls"; url:string; location?:string; };
type Store = { cameras:Camera[]; addCamera:(c:Camera)=>void; removeCamera:(id:string)=>void; };
export const useStore = create<Store>((set)=>({
  cameras:[], addCamera:(c)=>set((s)=>({cameras:[...s.cameras,c]})),
  removeCamera:(id)=>set((s)=>({cameras:s.cameras.filter(x=>x.id!==id)})),
}));
