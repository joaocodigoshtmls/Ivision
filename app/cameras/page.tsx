import { NewCameraForm } from "@/components/cameras/NewCameraForm";
import { CameraList } from "@/components/cameras/CameraList";
export default function CamerasPage(){
  return (<main className="space-y-6"><h1 className="text-2xl font-semibold">Câmeras</h1><NewCameraForm/><CameraList/></main>);
}
