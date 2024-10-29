import { json, type LoaderFunctionArgs, type MetaFunction } from '@remix-run/node';
import { i18n } from '~/modules/i18n/i18n.server';

import { useLoaderData } from '@remix-run/react';
import { getDefaultMetaTags, getLocaleMetaTags, getPageMetaTags, type PageMetadata } from '~/modules/meta';

// Consolidate illustrations into a single object for easy access
import cloudComputingIllustration from '~/assets/illustrations/cloud_computing.svg';
import cloudComputingExtra1Illustration from '~/assets/illustrations/cloud_computing_extra_1.svg';
import cloudComputingExtra2Illustration from '~/assets/illustrations/cloud_computing_extra_2.svg';
import cloudComputingExtra3Illustration from '~/assets/illustrations/cloud_computing_extra_3.svg';
import cloudSolutionsIllustration from '~/assets/illustrations/cloud_solutions.svg';
import backendEngineeringIllustration from '~/assets/illustrations/backend_engineering.svg';
import observabilityIllustration from '~/assets/illustrations/observability.svg';
import performanceImprovementsIllustration from '~/assets/illustrations/performance_improvements.svg';
import wavesIllustration from '~/assets/illustrations/waves.svg';

export const handle = { i18n: 'home' };

export async function loader({ request }: LoaderFunctionArgs) {
  const t = await i18n.getFixedT(request, 'home');
  return json({
    meta: t('meta', { returnObjects: true }) as PageMetadata,
    title: t('title'),
    description: t('description'),
    services: t('services', { returnObjects: true }) as {
      title: string;
      items: Record<string, { title: string; description: string }>;
    },
  });
}

export const meta: MetaFunction<typeof loader> = ({ data, location }) => {
  return [...getDefaultMetaTags(), ...getPageMetaTags(data?.meta), ...getLocaleMetaTags(location.pathname)];
};

interface ServiceCardProps {
  image: string;
  title: string;
  description: string;
  reverse?: boolean;
}

function ServiceCard({ image, title, description }: ServiceCardProps) {
  return (
    <div className="even:md:text-right items-center grid md:grid-cols-2 odd:md:text-left group">
      <img className="group-odd:md:order-last mx-auto p-6 w-64" src={image} alt={title} loading="lazy" />
      <div className="p-6">
        <h3 className="mb-3 font-bold text-2xl text-gray-800 lg:text-3xl leading-none">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
}

export default function Index() {
  const { title, description, services } = useLoaderData<typeof loader>();

  return (
    <>
      <header className="px-16 md:px-8 pt-24">
        <div className="items-center gap-8 grid md:grid-cols-2 mx-auto md:my-4 md:p-8 container">
          <div className="gap-4 grid text-black-900 text-center md:text-left">
            <h1 className="font-bold text-3xl lg:text-5xl leading-tight whitespace-pre-line">{title}</h1>
            <p className="text-lg lg:text-2xl leading-normal">{description}</p>
          </div>
          <div className="relative mx-auto w-4/5 lg:w-3/5 text-center">
            <img
              className="relative z-20 w-full"
              src={cloudComputingIllustration}
              alt="People monitoring statistics"
              loading="lazy"
            />
            <img
              className="top-0 left-0 -z-10 absolute w-full animate-float-vertical"
              src={cloudComputingExtra1Illustration}
              alt="A cloud"
              loading="lazy"
            />
            <img
              className="top-0 right-0 bottom-0 left-0 -z-10 absolute w-full animate-float-depth"
              src={cloudComputingExtra2Illustration}
              alt="A monitor"
              loading="lazy"
            />
            <img
              className="right-0 bottom-0 -z-10 absolute w-full animate-float-depth"
              style={{ animationDelay: '0.8s' }}
              src={cloudComputingExtra3Illustration}
              alt="Another monitor"
              loading="lazy"
            />
          </div>
        </div>
      </header>

      <div className="relative z-20 -mt-4 lg:-mt-18 -mb-[1px]">
        <img className="w-full" src={wavesIllustration} alt="Waves" />
      </div>

      <section className="bg-white py-8">
        <div className="mx-auto max-w-5xl container">
          <h2 className="my-2 p-4 font-bold text-3xl text-center text-gray-800 lg:text-5xl leading-tight">
            {services.title}
          </h2>
          <div className="bg-ocoda-gradient opacity-25 mx-auto mb-4 rounded-t w-2/5 h-1 gradient" />
          <div className="flex flex-col gap-8 p-4 lg:p-0 text-center">
            <ServiceCard
              image={cloudSolutionsIllustration}
              title={services.items.cloud.title}
              description={services.items.cloud.description}
            />
            <ServiceCard
              image={backendEngineeringIllustration}
              title={services.items.backend.title}
              description={services.items.backend.description}
              reverse
            />
            <ServiceCard
              image={observabilityIllustration}
              title={services.items.observability.title}
              description={services.items.observability.description}
            />
            <ServiceCard
              image={performanceImprovementsIllustration}
              title={services.items.performance.title}
              description={services.items.performance.description}
              reverse
            />
          </div>
        </div>
      </section>

      <section className="w-full h-60">
        <img className="-mt-px w-full" style={{ transform: 'scale(-1, -1)' }} src={wavesIllustration} alt="Waves" />
      </section>
    </>
  );
}
