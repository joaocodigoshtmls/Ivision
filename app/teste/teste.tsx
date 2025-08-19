// Exemplo numa página React/Next
import HlsPlayer from "@/components/HlsPlayer";

export default function CameraTestePage() {
  return (
    <main className="p-6">
      <h1 className="text-xl font-semibold mb-4">Teste HLS</h1>

      {/* Troque pelo seu .m3u8 */}
      <HlsPlayer
        src="https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_fmp4/master.m3u8"
        // Para diagnóstico: use também um link seu que está dando 404 e veja a mensagem
        // src="https://cph-p2p-msl.akamaized.net/hls/live/2000341/test/master.m3u8"
        autoPlay
        muted
        controls
        className="max-w-3xl"
      />
    </main>
  );
}
