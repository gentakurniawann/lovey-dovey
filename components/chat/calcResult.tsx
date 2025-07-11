// components/CalculatingModal.tsx
import dynamic from "next/dynamic";
import CalculatingAnimation from "@/public/animations/calculating.json";

const Player = dynamic(() => import("lottie-react"), { ssr: false });

export const CalculatingModal = ({ isOpen }: { isOpen: boolean }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-xl text-center w-80">
        <Player
          autoplay
          loop
          animationData={CalculatingAnimation}
          style={{ height: "240px" }}
        />
        <p className="font-pixelify text-lg font-medium text-gray-800">
          Calculating your result...
        </p>
      </div>
    </div>
  );
};
