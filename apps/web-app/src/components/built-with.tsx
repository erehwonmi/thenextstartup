import { useTranslations } from 'next-intl';

import LogoAxiom from '../../public/images/LOGO_AXIOM.png';
import LogoCoolify from '../../public/images/LOGO_COOLIFY.png';
import LogoCloudflare from '../../public/images/LOGO_CLOUDFLARE.png';
import LogoDrizzle from '../../public/images/LOGO_DRIZZLE.png';
import LogoNextJs from '../../public/images/LOGO_NEXTJS.png';
import LogoNx from '../../public/images/LOGO_NX.png';
import LogoSupademo from '../../public/images/LOGO_SUPADEMO.png';
import LogoShadcn from '../../public/images/LOGO_SHADCN.png';
import LogoStripe from '../../public/images/LOGO_STRIPE.png';
import LogoTurso from '../../public/images/LOGO_TURSO.png';

import Image from 'next/image';

const BuiltWith = () => {
  const t = useTranslations('BuiltWith');

  return (
    <section
      id="built-with"
      className={`flex flex-col bg-gradient-to-b from-white dark:from-black dark:via-neutral-900 via-neutral-50 dark:to-neutral-800 to-neutral-100 sm:py-16`}
    >
      <div
        className={`flex-1 flex items-center flex-col xl:px-0 sm:px-16 m-10 xl:m-0 justify-center text-center`}
      >
        <h2 className="p-10 flex-1 font-josefinSans text-3xl">
          {t.rich('supercharge')}
        </h2>
        <div className="grid xl:grid-cols-5 grid-cols-2 xl:gap-30 md:gap-40 gap-20 mt-16 grayscale xl:mx-20">
          <Image
            className="w-52 xl:mt-10 mt-4"
            alt="axiom-logo"
            src={LogoAxiom}
          />
          <Image
            className="w-52 xl:mt-8 mt-4"
            alt="coolify-logo"
            src={LogoCoolify}
          />
          <Image
            className="w-52 xl:mt-6"
            alt="cloudflare-logo"
            src={LogoCloudflare}
          />
          <Image
            className="xl:w-48 md:w-48 w-40 xl:mt-10 mt-2"
            alt="drizzle-logo"
            src={LogoDrizzle}
          />
          <Image
            className="w-52 xl:mt-8 md:mt-6 mt-4"
            alt="nextjs-logo"
            src={LogoNextJs}
          />
          <Image
            className="xl:w-20 md:w-20 w-14 mt-2"
            alt="nx-logo"
            src={LogoNx}
          />
          <Image className="w-52 xl:mt-5" alt="stripe-logo" src={LogoStripe} />
          <Image
            className="w-52 xl:mt-8 md:mt-6 mt-4"
            alt="supademo-logo"
            src={LogoSupademo}
          />
          <Image
            className="w-full xl:mt-8 md:mt-6 mt-4"
            alt="shadcnui-logo"
            src={LogoShadcn}
          />
          <Image
            className="w-52 xl:mt-8 md:mt-6 mt-4"
            alt="tursodb-logo"
            src={LogoTurso}
          />
        </div>
      </div>
    </section>
  );
};

export default BuiltWith;
