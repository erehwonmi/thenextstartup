const ShowcaseMobile = ({ url }: { url: string }) => {
  return (
    <div className="flex flex-col justify-center xl:hidden lg:hidden md:hidden">
      <div className="relative mx-auto border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[680px] w-[330px] mt-10">
        <div className="h-[32px] w-[3px] bg-gray-800 absolute -left-[17px] top-[72px] rounded-l-lg"></div>
        <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[17px] top-[124px] rounded-l-lg"></div>
        <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[17px] top-[178px] rounded-l-lg"></div>
        <div className="h-[64px] w-[3px] bg-gray-800 absolute -right-[17px] top-[142px] rounded-r-lg"></div>
        <div className="rounded-[1rem] overflow-hidden w-[305px] h-[650px] bg-gray-800">
          <iframe
            src={url}
            title="showcase-mobile"
            allow="clipboard-write"
            allowFullScreen
            seamless
            className="h-[660px] mx-auto rounded-3xl"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default ShowcaseMobile;
