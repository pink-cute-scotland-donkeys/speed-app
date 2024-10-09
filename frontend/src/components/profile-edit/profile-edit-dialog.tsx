import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';

export default function ProfileEditDialog() {
  const router = useRouter();

  return (
    <div className="flex-1 flex justify-center items-center bg-[#8D8D8D]">
      <div className="bg-gray-100 p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl text-black mb-4 w-full text-start border-b border-black pb-2">
          Profile Edited
        </h1>
        <p>You have successfully edited your user profile.</p>
        <Button className="w-full mt-4" onClick={() => router.push('/profile')}>
          Back
        </Button>
      </div>
    </div>
  );
}
