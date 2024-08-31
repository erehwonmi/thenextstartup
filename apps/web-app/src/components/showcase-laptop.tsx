const ShowcaseLaptop = ({ url }: { url: string }) => {
  return (
    <div className="mt-16 xl:block lg:block md:block hidden">
      <div className="w-full mx-auto border-gray-800 dark:border-gray-800 bg-gray-800 border-[8px] rounded-t-xl h-[475] max-w-[900px] md:max-w-[675px] xl:max-w-[1024px]">
        <div className="rounded-lg overflow-hidden h-[475px] md:h-[375px] xl:h-[500px] bg-white dark:bg-gray-800">
          <iframe
            src={url}
            title="showcase-laptop"
            allow="clipboard-write"
            allowFullScreen
            seamless
            className="w-full h-full mx-auto rounded-3xl"
          ></iframe>
        </div>
      </div>
      <div className="w-full relative mx-auto bg-gray-900 dark:bg-gray-700 rounded-b-xl rounded-t-sm h-[17px] max-w-[950px] md:h-[21px] md:max-w-[720px] xl:max-w-[1200px]">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 rounded-b-xl w-[56px] h-[5px] md:w-[96px] md:h-[8px] bg-gray-800"></div>
      </div>
    </div>
  );
  {
    /* <div className="relative mx-auto bg-gray-900 dark:bg-gray-700 rounded-b-xl rounded-t-sm h-[17px] max-w-[351px] md:h-[21px] md:max-w-[597px]">
    <div className="absolute left-1/2 top-0 -translate-x-1/2 rounded-b-xl w-[56px] h-[5px] md:w-[96px] md:h-[8px] bg-gray-800"></div>
</div> */
  }

  // );
};

export default ShowcaseLaptop;
