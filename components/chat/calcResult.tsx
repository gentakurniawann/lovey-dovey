// components/CalculatingModal.tsx
import { Loader2 } from "lucide-react";



export const CalculatingModal = ({ isOpen }: { isOpen: boolean }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-xl text-center space-y-4 w-80">
        <Loader2 className="animate-spin w-8 h-8 mx-auto text-pink-500" />
        <p className="text-lg font-medium text-gray-800">
          Calculating your result...
        </p>
      </div>
    </div>
  );
};
