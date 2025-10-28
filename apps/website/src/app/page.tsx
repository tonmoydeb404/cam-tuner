import CameraPreview from "@/components/camera-preview";

type Props = {};

const HomePage = (props: Props) => {
  return (
    <div className="grid grid-cols-12 max-w-full h-screen overflow-hidden">
      <div className="col-span-8 p-4">
        <div className="w-full h-full flex flex-col items-center justify-center border-2 border-gray-300 border-dashed rounded-2xl p-4">
          <CameraPreview className="w-full max-w-full max-h-full" />
        </div>
      </div>
      <div className="col-span-4 p-4">
        <div className="w-full h-full flex flex-col items-center justify-center border-2 border-gray-300 border-dashed rounded-2xl">
          <span className="text-2xl text-gray-400">Tools panel</span>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
