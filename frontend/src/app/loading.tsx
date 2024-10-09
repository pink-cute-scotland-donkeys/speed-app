import { LoaderCircle } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex-1 flex justify-center items-center bg-[#8D8D8D] p-8">
      <LoaderCircle size={36} className="animate-spin text-white" />
    </div>
  );
}
