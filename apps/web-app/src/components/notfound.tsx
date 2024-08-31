import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const NotFound = () => {
  return (
    <section className="py-20 bg-['#000000'] w-full h-full">
      <div className="mx-auto">
        <div className="mx-4 flex flex-col items-center">
          <Image
            src="/images/404.png"
            alt="404-img"
            width={500}
            height={500}
            className=""
          />

          <p className="mb-8 text-base text-neutral-400 text-center">
            The page you are looking for does not exist. It might have been
            moved or deleted.
          </p>
          <Link
            href="/"
            className="rounded-3xl px-7 py-3 text-base font-medium text-dark transition bg-white"
          >
            Home
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NotFound;
