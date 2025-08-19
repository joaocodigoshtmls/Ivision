import Link from "next/link";
import { Camera, Play, ShieldCheck } from "lucide-react";

export default function HomePage() {
  return (
    <main className="space-y-10">
      <header className="flex items-center justify-between rounded-2xl bg-zinc-900/50 p-6 ring-1 ring-white/10">
        <h1 className="text-2xl font-semibold tracking-tight">IVision</h1>
        <nav className="flex gap-4 text-sm text-zinc-300">
          <Link href="/dashboard" className="hover:text-white">Dashboard</Link>
          <Link href="/cameras" className="hover:text-white">Câmeras</Link>
        </nav>
      </header>

      <section className="grid gap-6 md:grid-cols-3">
        <Feature icon={<Camera />} title="Conecte suas câmeras" desc="Adicione RTSP/ONVIF/WebRTC." />
        <Link href="/live" className="rounded-2xl border border-white/10 p-5 hover:border-white/20 transition-colors">
          <div className="mb-3 flex items-center gap-2 text-zinc-300">
            <span className="rounded-xl bg-white/5 p-2"><Play /></span>
            <h3 className="font-medium text-white">Ao vivo</h3>
          </div>
          <p className="text-sm text-zinc-400">WebRTC quando disponível; fallback HLS.</p>
        </Link>
        <Feature icon={<ShieldCheck />} title="Segurança" desc="RBAC e auditoria." />
      </section>
    </main>
  );
}

function Feature({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-white/10 p-5">
      <div className="mb-3 flex items-center gap-2 text-zinc-300">
        <span className="rounded-xl bg-white/5 p-2">{icon}</span>
        <h3 className="font-medium text-white">{title}</h3>
      </div>
      <p className="text-sm text-zinc-400">{desc}</p>
    </div>
  );
}
