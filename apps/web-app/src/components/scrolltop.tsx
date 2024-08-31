'use client';

import { useEffect, useState } from 'react';
import { ChevronsUp } from 'lucide-react';

export default function ScrollTop() {
  const [isVisible, setIsVisible] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <div className="fixed bottom-8 right-2 z-[999]">
      {isVisible && (
        <div
          onClick={scrollToTop}
          aria-label="scroll to top"
          className="back-to-top flex h-10 w-10 cursor-pointer items-center justify-center rounded-md bg-neutral-800 text-white shadow-md transition duration-300 ease-in-out hover:bg-dark"
        >
          <ChevronsUp />
        </div>
      )}
    </div>
  );
}
