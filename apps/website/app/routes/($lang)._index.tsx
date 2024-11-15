import { type LoaderFunctionArgs, type MetaFunction, json } from '@remix-run/node';
import { i18n } from '~/modules/i18n/i18n.server';

import { useLoaderData } from '@remix-run/react';
import SectionTitle from '~/components/section/SectionTitle';
import { type PageMetadata, getDefaultMetaTags, getLocaleMetaTags, getPageMetaTags } from '~/modules/meta';
import type { en } from '~/resources/locales/en';
import { generateImgSrc } from '~/utils/generate-img-src.server';

import { WavesIllustration } from '~/resources/illustrations';

export const handle = { i18n: 'home' };

export async function loader({ request }: LoaderFunctionArgs) {
  const t = await i18n.getFixedT(request, 'home');

  return json({
    meta: t('meta', { returnObjects: true }) as PageMetadata,
    copy: {
      title: t('title'),
      description: t('description'),
      services: t('services', { returnObjects: true }) as (typeof en)['home']['services'],
    },
    images: {
      waves: generateImgSrc({ src: 'waves.svg' }),
      cloudComputing: generateImgSrc({ src: 'cloud_computing.svg' }),
      cloudComputingExtra1: generateImgSrc({ src: 'cloud_computing_extra_1.svg' }),
      cloudComputingExtra2: generateImgSrc({ src: 'cloud_computing_extra_2.svg' }),
      cloudComputingExtra3: generateImgSrc({ src: 'cloud_computing_extra_3.svg' }),
      cloudSolutions: generateImgSrc({ src: 'cloud_solutions.svg' }),
      backendEngineering: generateImgSrc({ src: 'backend_engineering.svg' }),
      observability: generateImgSrc({ src: 'observability.svg' }),
      performanceImprovements: generateImgSrc({ src: 'performance_improvements.svg' }),
    },
  });
}

export const meta: MetaFunction<typeof loader> = ({ data, location }) => {
  return [...getDefaultMetaTags(), ...getPageMetaTags(data?.meta), ...getLocaleMetaTags(location.pathname)];
};

interface ServiceCardProps {
  image: {
    url: string;
    alt: string;
    width: number;
    height: number;
  };
  title: string;
  description: string;
  reverse?: boolean;
  lazy?: boolean;
}

function ServiceCard({ image, title, description, lazy }: ServiceCardProps) {
  return (
    <div className="even:md:text-right items-center grid md:grid-cols-2 odd:md:text-left group">
      <img
        src={image.url}
        alt={image.alt}
        className="group-odd:md:order-last mx-auto p-6 w-64"
        width={image.width}
        height={image.height}
        loading={lazy ? 'lazy' : 'eager'}
      />
      <div className="p-6">
        <SectionTitle>{title}</SectionTitle>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
}

export default function Index() {
  const { copy, images } = useLoaderData<typeof loader>();

  return (
    <>
      <header className="mx-auto pt-24 container">
        <div className="items-center gap-8 grid md:grid-cols-2 mx-auto md:my-4 md:p-8">
          <div className="gap-4 grid text-black-900 text-center md:text-left">
            <h1 className="font-bold text-3xl lg:text-5xl leading-tight whitespace-pre-line">{copy.title}</h1>
            <p className="text-lg lg:text-2xl leading-normal">{copy.description}</p>
          </div>
          <div className="relative mx-auto w-4/5 xl:w-3/5 text-center">
            <img
              src={images.cloudComputing}
              alt="People monitoring statistics"
              className="relative z-20 w-full"
              width={221}
              height={150}
              loading="eager"
            />
            <img
              src={images.cloudComputingExtra1}
              alt="A cloud"
              className="top-0 left-0 -z-10 absolute w-full animate-float-vertical"
              width={221}
              height={150}
              loading="lazy"
            />
            <img
              src={images.cloudComputingExtra2}
              alt="A monitor"
              className="top-0 right-0 bottom-0 left-0 -z-10 absolute w-full animate-float-depth"
              width={221}
              height={150}
              loading="lazy"
            />
            <img
              src={images.cloudComputingExtra3}
              alt="A monitor"
              className="right-0 bottom-0 -z-10 absolute w-full animate-float-depth"
              style={{ animationDelay: '0.8s' }}
              width={221}
              height={150}
              loading="lazy"
            />
          </div>
        </div>
      </header>

      <WavesIllustration className="relative z-20 w-full md:h-16 lg:h-32" />

      <section className="bg-white -mt-px py-8">
        <div className="mx-auto max-w-5xl container">
          <h2 className="my-2 p-4 font-bold text-3xl text-center text-gray-800 lg:text-5xl leading-tight">
            {copy.services.title}
          </h2>
          <div className="bg-ocoda-gradient opacity-25 mx-auto mb-4 rounded-t w-2/5 h-1 gradient" />
          <div className="flex flex-col gap-8 p-4 lg:p-0 text-center">
            <ServiceCard
              image={{
                url: images.cloudSolutions,
                alt: copy.services.items.cloud.image.alt,
                width: 210,
                height: 150,
              }}
              title={copy.services.items.cloud.title}
              description={copy.services.items.cloud.description}
            />
            <ServiceCard
              image={{
                url: images.backendEngineering,
                alt: copy.services.items.backend.image.alt,
                width: 151,
                height: 150,
              }}
              title={copy.services.items.backend.title}
              description={copy.services.items.backend.description}
              reverse
            />
            <ServiceCard
              image={{
                url: images.observability,
                alt: copy.services.items.observability.image.alt,
                width: 130,
                height: 150,
              }}
              title={copy.services.items.observability.title}
              description={copy.services.items.observability.description}
            />
            <ServiceCard
              image={{
                url: images.performanceImprovements,
                alt: copy.services.items.performance.image.alt,
                width: 148,
                height: 150,
              }}
              title={copy.services.items.performance.title}
              description={copy.services.items.performance.description}
              reverse
              lazy
            />
          </div>
        </div>
      </section>
    </>
  );
}
