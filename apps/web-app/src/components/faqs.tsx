'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@ts/uikit';

const Faqs = () => {
  return (
    <section
      id="faqs"
      className={`flex flex-col bg-gradient-to-b from-white dark:from-black  dark:to-neutral-900 to-neutral-100 py-28`}
    >
      <h2 className="font-josefinSans text-center text-4xl mb-10">
        Frequently Asked Questions (FAQs)
      </h2>
      <Accordion
        type="single"
        collapsible
        className="w-[70%] lg:w-[50%] mx-auto my-10"
      >
        <AccordionItem value="faq-1">
          <AccordionTrigger>Is this template free?</AccordionTrigger>
          <AccordionContent>Yes. Zero costs.</AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
};

export default Faqs;
