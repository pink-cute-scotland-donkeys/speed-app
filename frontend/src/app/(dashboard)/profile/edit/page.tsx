'use client';

import ProfileEditForm from '@/components/profile-edit/profile-edit-form';
import { Button } from '@/components/ui/button';
import withAuth from '@/lib/with-auth';
import { useRouter } from 'next/navigation';

const ProfileEditPage = () => {
  const router = useRouter();

  return (
    <div className="flex-1 flex justify-center items-start bg-[#8D8D8D] p-8">
      <div className="bg-gray-100 p-8 rounded shadow-md w-3/4">
        <h2 className="flex flex-row justify-between text-2xl text-black mb-8 w-full text-start border-b border-black pb-2">
          Edit Profile
          <Button
            variant="outline"
            className="border-black"
            onClick={() => router.back()}
          >
            Back
          </Button>
        </h2>
        <ProfileEditForm />
      </div>
    </div>
  );
};

export default withAuth(ProfileEditPage, 'registered');
