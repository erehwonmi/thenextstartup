import PlansSection from './common/plans-section';

const Plans = () => {
  return (
    <section
      id="plans"
      className={`flex flex-col bg-gradient-to-b from-neutral-100 dark:from-neutral-800  dark:to-black to-white sm:py-16`}
    >
      <div className="text-center">
        <h2 className="font-josefinSans text-4xl mb-5">Pricing Plans</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-7">
          These are just sample cards that you can use
        </p>
      </div>

      <div className="">
        <PlansSection />
      </div>
    </section>
  );
};

export default Plans;
