'use client';

import { LoadingSpinner } from '@ts/uikit';

const Loading = () => {
  return (
    <div className="flex m-10 justify-center items-center flex-col">
      <div className="pb-4">
        <h3 className="font-josefinSans">Just give us a second.</h3>
      </div>
      <div className="flex justify-center items-center">
        <LoadingSpinner />
      </div>
    </div>
  );
};

export default Loading;
