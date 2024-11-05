import { type LoaderFunctionArgs, type MetaFunction, json } from '@remix-run/node';
import { i18n } from '~/modules/i18n/i18n.server';

import { useLoaderData } from '@remix-run/react';
import { type PageMetadata, getDefaultMetaTags, getLocaleMetaTags, getPageMetaTags } from '~/modules/meta';
import type { en } from '~/resources/locales/en';
import { generateImgSrc } from '~/utils/generate-img-src.server';

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
  image: string;
  imageAlt: string;
  title: string;
  description: string;
  reverse?: boolean;
}

function ServiceCard({ image, imageAlt, title, description }: ServiceCardProps) {
  return (
    <div className="even:md:text-right items-center grid md:grid-cols-2 odd:md:text-left group">
      <img src={image} alt={imageAlt} className="group-odd:md:order-last mx-auto p-6 w-64" />
      <div className="p-6">
        <h3 className="mb-3 font-bold text-2xl text-gray-800 lg:text-3xl leading-none">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
}

export default function Index() {
  const { copy, images } = useLoaderData<typeof loader>();

  return (
    <>
      <header className="px-16 md:px-8 pt-24">
        <div className="items-center gap-8 grid md:grid-cols-2 mx-auto md:my-4 md:p-8 container">
          <div className="gap-4 grid text-black-900 text-center md:text-left">
            <h1 className="font-bold text-3xl lg:text-5xl leading-tight whitespace-pre-line">{copy.title}</h1>
            <p className="text-lg lg:text-2xl leading-normal">{copy.description}</p>
          </div>
          <div className="relative mx-auto w-4/5 lg:w-3/5 text-center">
            <img src={images.cloudComputing} alt="People monitoring statistics" className="relative z-20 w-full" />
            <img
              src={images.cloudComputingExtra1}
              alt="A cloud"
              className="top-0 left-0 -z-10 absolute w-full animate-float-vertical"
            />
            <img
              src={images.cloudComputingExtra2}
              alt="A monitor"
              className="top-0 right-0 bottom-0 left-0 -z-10 absolute w-full animate-float-depth"
            />
            <img
              src={images.cloudComputingExtra3}
              alt="A monitor"
              className="right-0 bottom-0 -z-10 absolute w-full animate-float-depth"
              style={{ animationDelay: '0.8s' }}
            />
          </div>
        </div>
      </header>

      <div className="relative z-20 -mt-4 lg:-mt-18 -mb-[1px]">
        <img src={images.waves} alt="Waves" className="w-full" />
      </div>

      <section className="bg-white py-8">
        <div className="mx-auto max-w-5xl container">
          <h2 className="my-2 p-4 font-bold text-3xl text-center text-gray-800 lg:text-5xl leading-tight">
            {copy.services.title}
          </h2>
          <div className="bg-ocoda-gradient opacity-25 mx-auto mb-4 rounded-t w-2/5 h-1 gradient" />
          <div className="flex flex-col gap-8 p-4 lg:p-0 text-center">
            <ServiceCard
              image={images.cloudSolutions}
              imageAlt={copy.services.items.cloud.image.alt}
              title={copy.services.items.cloud.title}
              description={copy.services.items.cloud.description}
            />
            <ServiceCard
              image={images.backendEngineering}
              imageAlt={copy.services.items.backend.image.alt}
              title={copy.services.items.backend.title}
              description={copy.services.items.backend.description}
              reverse
            />
            <ServiceCard
              image={images.observability}
              imageAlt={copy.services.items.observability.image.alt}
              title={copy.services.items.observability.title}
              description={copy.services.items.observability.description}
            />
            <ServiceCard
              image={images.performanceImprovements}
              imageAlt={copy.services.items.performance.image.alt}
              title={copy.services.items.performance.title}
              description={copy.services.items.performance.description}
              reverse
            />
          </div>
        </div>
      </section>

      <section className="w-full h-60">
        <img src={images.waves} alt="Waves" className="-mt-px w-full" style={{ transform: 'scale(-1, -1)' }} />
      </section>
    </>
  );
}
