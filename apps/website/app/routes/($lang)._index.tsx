import { json, type LoaderFunctionArgs, type MetaFunction } from '@remix-run/node';
import { i18n } from '~/modules/i18n/i18n.server';

import cloudComputingIllustration from '~/assets/illustrations/cloud_computing.svg';
import cloudComputingExtra1Illustration from '~/assets/illustrations/cloud_computing_extra_1.svg';
import cloudComputingExtra2Illustration from '~/assets/illustrations/cloud_computing_extra_2.svg';
import cloudComputingExtra3Illustration from '~/assets/illustrations/cloud_computing_extra_3.svg';
import wavesIllustration from '~/assets/illustrations/waves.svg';
import { useLoaderData } from '@remix-run/react';
import { getLocaleMetaTags } from '~/modules/i18n/resources';

export const handle = { i18n: 'home' };

export async function loader({ request }: LoaderFunctionArgs) {
  const t = await i18n.getFixedT(request, 'home');
  return json({ title: t('title'), description: t('description') });
}

export const meta: MetaFunction<typeof loader> = ({ data, location }) => {
  return [
    { title: data?.title },
    {
      title: 'keywords',
      content:
        'Ocoda BV,ocoda,it consulting,consulting,it consultancy,consultancy,it,ict,cloud,server,backend,ci,cd,cicd,automation,containerization,microservices,computing,amazon web services,aws,belgium',
    },
    { name: 'description', content: data?.description },
    { name: 'author', content: 'Ocoda BV' },
    { name: 'robots', content: 'all' },
    ...getLocaleMetaTags(location.pathname),
  ];
};

export default function Index() {
  const { title, description } = useLoaderData<typeof loader>();

  return (
    <>
      <div className="px-16 md:px-8 pt-24">
        <div className="items-center gap-8 grid md:grid-cols-2 md:auto-cols-max mx-auto md:my-4 md:p-8 container">
          <div className="gap-4 grid text-black-900 text-center md:text-left">
            <h1 className="font-bold text-5xl leading-tight whitespace-pre-line">{title}</h1>
            <p className="text-2xl leading-normal">{description}</p>
          </div>
          <div className="relative mx-auto w-4/5 lg:w-3/5 text-center">
            <img className="relative z-20 w-full" src={cloudComputingIllustration} alt="People monitoring statistics" />
            <img
              className="top-0 left-0 -z-10 absolute w-full animate-float-vertical"
              src={cloudComputingExtra1Illustration}
              alt="A cloud"
            />
            <img
              className="top-0 right-0 bottom-0 left-0 -z-10 absolute w-full animate-float-depth"
              src={cloudComputingExtra2Illustration}
              alt="A monitor"
            />
            <img
              className="right-0 bottom-0 -z-10 absolute w-full animate-float-depth"
              style={{ animationDelay: '0.8s' }}
              src={cloudComputingExtra3Illustration}
              alt="A monitor"
            />
          </div>
        </div>
      </div>
      <div className="relative -mt-4 lg:-mt-18 -mb-[1px]">
        <img className="w-full" src={wavesIllustration} alt="Waves" />
      </div>
      <section className="bg-white py-8">
        <div className="m-8 mx-auto max-w-5xl container">
          <h2 className="my-2 w-full font-bold text-5xl text-center text-gray-800 leading-tight">{'foo'}</h2>
          <div className="mb-4 w-full">
            <div className="opacity-25 mx-auto my-0 py-0 rounded-t w-64 h-1 gradient" />
          </div>
          <div className="flex flex-wrap">
            <div className="p-6 w-5/6 sm:w-1/2">
              <h3 className="mb-3 font-bold text-3xl text-gray-800 leading-none">Lorem ipsum dolor sit amet</h3>
              <p className="mb-8 text-gray-600">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam at ipsum eu nunc commodo posuere et sit
                amet ligula.
                <br />
                <br />
                Images from:
                <a className="text-pink-500 underline" href="https://undraw.co/">
                  undraw.co
                </a>
              </p>
            </div>
            <div className="p-6 w-full sm:w-1/2">Foo</div>
          </div>
          <div className="flex sm:flex-row flex-col-reverse flex-wrap">
            <div className="mt-6 p-6 w-full sm:w-1/2">Foo</div>
            <div className="mt-6 p-6 w-full sm:w-1/2">
              <div className="align-middle">
                <h3 className="mb-3 font-bold text-3xl text-gray-800 leading-none">Lorem ipsum dolor sit amet</h3>
                <p className="mb-8 text-gray-600">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam at ipsum eu nunc commodo posuere et
                  sit amet ligula.
                  <br />
                  <br />
                  Images from:
                  <a className="text-pink-500 underline" href="https://undraw.co/">
                    undraw.co
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
