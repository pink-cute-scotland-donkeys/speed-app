'use client';

import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { ToastAction } from '../ui/toast';

const ProfileEditForm = () => {
  const { toast } = useToast();
  const router = useRouter();
  const { user, token } = useAuth();

  if (!user) throw new Error('User is not authenticated!');

  const schema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z
      .string()
      .email('Invalid email address')
      .refine((val) => val === user.email, {
        message: 'Email must match the current user email',
      }),
    bio: z.string().optional(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/${user._id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        toast({
          variant: 'destructive',
          title: 'Uh oh! Something went wrong.',
          description: 'There was a problem with your request.',
          action: (
            <ToastAction altText="Try again" onClick={() => onSubmit(data)}>
              Try again
            </ToastAction>
          ),
        });
        console.error('Error editing user profile:', errorData.message);
        return;
      }

      toast({
        variant: 'default',
        title: 'User profile edited successfully!.',
      });
      console.log('User profile edited successfully');

      router.push('/profile/edit/complete');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request.',
      });
      console.error('Error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* First Name Field */}
      <div className="mb-4">
        <label
          htmlFor="firstName"
          className="block text-gray-700 font-semibold mb-2"
        >
          First Name
        </label>
        <input
          type="text"
          id="firstName"
          {...register('firstName')}
          className={`w-full px-3 py-2 border ${
            errors.firstName ? 'border-red-500' : 'border-gray-400'
          } rounded`}
        />
        {errors.firstName && (
          <p className="text-red-500 text-sm mt-1">
            {errors.firstName.message}
          </p>
        )}
      </div>

      {/* Last Name Field */}
      <div className="mb-4">
        <label
          htmlFor="lastName"
          className="block text-gray-700 font-semibold mb-2"
        >
          Last Name
        </label>
        <input
          type="text"
          id="lastName"
          {...register('lastName')}
          className={`w-full px-3 py-2 border ${
            errors.lastName ? 'border-red-500' : 'border-gray-400'
          } rounded`}
        />
        {errors.lastName && (
          <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
        )}
      </div>

      {/* Email Field */}
      <div className="mb-4">
        <label
          htmlFor="email"
          className="block text-gray-700 font-semibold mb-2"
        >
          Confirm Email
        </label>
        <input
          type="email"
          id="email"
          {...register('email')}
          className={`w-full px-3 py-2 border ${
            errors.email ? 'border-red-500' : 'border-gray-400'
          } rounded`}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* Bio Field */}
      <div className="mb-4">
        <label htmlFor="bio" className="block text-gray-700 font-semibold mb-2">
          Bio
        </label>
        <textarea
          id="bio"
          {...register('bio')}
          className={`w-full px-3 py-2 border ${
            errors.bio ? 'border-red-500' : 'border-gray-400'
          } rounded`}
        />
        {errors.bio && (
          <p className="text-red-500 text-sm mt-1">{errors.bio.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-black text-white font-semibold py-2 rounded hover:bg-gray-800"
      >
        Confirm Edit
      </button>
    </form>
  );
};

export default ProfileEditForm;
