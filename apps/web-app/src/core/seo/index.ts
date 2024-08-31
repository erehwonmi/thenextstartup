const hostname =
  process.env.HOST_NAME || 'https://thenextstartup.erehwonmi.com';

const description = 'Build your next startup';
export const generateMetadata = ({
  title = 'Build your next startup',
}: {
  title?: string;
}) => {
  const t = `TheNextStartup | ${title}`;
  return {
    alternates: {
      canonical: hostname,
      languages: {
        'en': `${hostname}/en`,
        'jp': `${hostname}/jp`,
      },
    },
    metadataBase: new URL(hostname),
    keywords: ['startup', 'nextjs'],
    title: t,
    description,
    openGraph: {
      images: {
        url: '/images/opengraph-image.jpg',
        alt: 'thenextstartup-og',
        width: 1200,
        height: 630,
        type: 'image/jpg',
      },
      type: 'website',
      locale: 'en_US',
      url: hostname,
      siteName: 'TheNextStartup',
      title,
      description,
    },
  };
};
