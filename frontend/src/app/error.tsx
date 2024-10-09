'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function Error({ message }: { message?: string }) {
  const router = useRouter();

  return (
    <div className="flex-1 flex justify-center items-center bg-[#8D8D8D]">
      <div className="bg-gray-100 p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl text-black mb-4 w-full text-start border-b border-black pb-2">
          An Error Has Occurred
        </h1>
        <p>
          {message ||
            'An unexpected error has occurred. You are being shown this page to limit the amount of unexpected behaviour that can take place. The system administrator has been notified.'}
        </p>
        <Button className="w-full mt-4" onClick={() => router.back()}>
          Back
        </Button>
      </div>
    </div>
  );
}
