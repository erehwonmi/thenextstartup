import BuiltWith from '@web-app/components/built-with';
import Benefits from '@web-app/components/benefits';
import Footer from '@web-app/components/footer';
import Header from '@web-app/components/header';
import Hero from '@web-app/components/hero';
import { loadCurrentCustomer } from '@web-app/core/server/session';
import Plans from '@web-app/components/plans';
import Faqs from '@web-app/components/faqs';

export default async function Index() {
  const currentCustomer = await loadCurrentCustomer();

  return (
    <main className="bg-white dark:bg-black">
      <Header currentCustomer={currentCustomer} />
      <Hero />
      <BuiltWith />
      <Benefits />
      <Plans />
      <Faqs />
      <Footer />
    </main>
  );
}
