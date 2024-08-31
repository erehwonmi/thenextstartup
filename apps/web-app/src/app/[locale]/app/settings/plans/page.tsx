'use client';

import PlansSection from '@web-app/components/common/plans-section';
import { useSession } from '@web-app/core/contexts/session';
import { useRouter } from 'next/navigation';

const Plans = () => {
  const router = useRouter();
  const session = useSession();

  if (!session) {
    router.push('/');
  }

  const subscriptionTier = session && session.customerProfiles.subscriptionTier;

  return (
    <div className="flex flex-col">
      <div className="border-b-2 w-full">
        <h1 className="text-2xl font-josefinSans">Plans</h1>
        <p className="text-sm my-4">
          {`You're currently on the `}
          <span className="capitalize">{subscriptionTier}</span> plan
        </p>
      </div>
      <div className="flex justify-center w-full mt-10">
        <PlansSection />
      </div>
    </div>
  );
};

export default Plans;
