'use client';

import Error from '@/app/error';
import Loading from '@/app/loading';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { capitalise } from '@/lib/utils';
import withAuth from '@/lib/with-auth';
import { ListCheck, Paperclip, Search, Star, UserIcon } from 'lucide-react';
import Link from 'next/link';

const ProfilePage = () => {
  const { user, error } = useAuth();

  if (error) return <Error message={error} />;
  if (!user) return <Loading />;

  return (
    <div className="flex-1 flex justify-center items-start bg-[#8D8D8D] p-8">
      <div className="flex flex-col bg-gray-100 p-8 rounded shadow-md w-3/4 gap-16">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-16">
          <span className="p-12 bg-white rounded-full text-4xl text-black">
            <UserIcon size={96} />
          </span>
          <div className="w-full flex flex-col gap-8">
            <div className="flex flex-col lg:flex-row items-center gap-4">
              <div className="flex flex-col items-center lg:items-start">
                <h2 className="text-4xl my-1.5">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-gray-500">{`${capitalise(user.role)}`}</p>
              </div>
              <Button
                variant="outline"
                className="border-black bg-transparent mx-auto lg:ml-auto lg:mr-0"
                asChild
              >
                <Link href="/profile/edit">Edit Profile</Link>
              </Button>
            </div>
            <div>
              <h3 className="text-xl">Bio</h3>
              <div className="flex flex-col space-y-2">
                <p className="text">{user.bio || `No user biography...`}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-8">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 text-2xl text-gray-500">
            <div className="grid grid-cols-2 p-8 bg-white rounded-xl">
              <Paperclip size={32} />
              <p>
                {user.articlesPublished?.length || 0}{' '}
                <span className="text-base">published</span>
              </p>
            </div>
            <div className="grid grid-cols-2 p-8 bg-white rounded-xl">
              <ListCheck size={32} />
              <p>
                {user.articlesModerated?.length || 0}{' '}
                <span className="text-base">moderated</span>
              </p>
            </div>
            <div className="grid grid-cols-2 p-8 bg-white rounded-xl">
              <Search size={32} />
              <p>
                {user.articlesAnalysed?.length || 0}{' '}
                <span className="text-base">analysed</span>
              </p>
            </div>
            <div className="grid grid-cols-2 p-8 bg-white rounded-xl">
              <Star size={32} />
              <p>
                {user.articlesRated?.length || 0}{' '}
                <span className="text-base">rated</span>
              </p>
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-xl">Recently Published Articles</h3>
          <div className="flex flex-col space-y-2">
            {user.articlesPublished?.length ? (
              user.articlesPublished.map((article) => (
                <div key={article} className="flex items-center gap-4">
                  <p>{article}</p>
                  <Button variant="outline" asChild>
                    <Link href={`/article/${article}`}>View Article</Link>
                  </Button>
                </div>
              ))
            ) : (
              <p>No articles published...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default withAuth(ProfilePage, 'registered');
