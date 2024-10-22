import type { MetaFunction } from '@remix-run/node';

import communicationIllustration from '~/assets/illustrations/communication.svg';
import wavesIllustration from '~/assets/illustrations/waves.svg';

export const meta: MetaFunction = () => {
  return [
    { title: 'Ocoda' },
    {
      title: 'keywords',
      content:
        'Ocoda BV,ocoda,it consulting,consulting,it consultancy,consultancy,it,ict,cloud,server,backend,ci,cd,cicd,automation,containerization,microservices,computing,amazon web services,aws,belgium',
    },
    {
      name: 'description',
      content: 'Ocoda BV specializes in creating innovative web solutions.',
    },
    { name: 'author', content: 'Ocoda BV' },
    { name: 'robots', content: 'all' },
  ];
};

export default function Index() {
  return (
    <>
      <div className="px-16 md:px-8 pt-24">
        <div className="container px-3 mx-auto flex flex-wrap flex-col md:flex-row items-center">
          <div className="flex flex-col w-full md:w-2/5 text-center md:text-left text-black-900">
            <h1 className="my-4 text-5xl font-bold leading-tight">
              Your Trusted
              <br />
              IT Solutions Partner
            </h1>
            <p className="leading-normal text-2xl mb-8">
              Ocoda empowers businesses by delivering tailored IT consultancy services designed to optimize performance,
              drive innovation and enhance efficiency.
            </p>
          </div>
          <div className="w-full md:w-3/5 py-6 text-center">
            <img className="w-full md:w-4/5 z-50" src={communicationIllustration} alt="People communicating" />
          </div>
        </div>
      </div>
      <div className="relative -mt-12 lg:-mt-24 -mb-[1px]">
        <img className="w-full" src={wavesIllustration} alt="Waves" />
      </div>
      <section className="bg-white py-8">
        <div className="container max-w-5xl mx-auto m-8">
          <h2 className="w-full my-2 text-5xl font-bold leading-tight text-center text-gray-800">Title</h2>
          <div className="w-full mb-4">
            <div className="h-1 mx-auto gradient w-64 opacity-25 my-0 py-0 rounded-t" />
          </div>
          <div className="flex flex-wrap">
            <div className="w-5/6 sm:w-1/2 p-6">
              <h3 className="text-3xl text-gray-800 font-bold leading-none mb-3">Lorem ipsum dolor sit amet</h3>
              <p className="text-gray-600 mb-8">
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
            <div className="w-full sm:w-1/2 p-6">Foo</div>
          </div>
          <div className="flex flex-wrap flex-col-reverse sm:flex-row">
            <div className="w-full sm:w-1/2 p-6 mt-6">Foo</div>
            <div className="w-full sm:w-1/2 p-6 mt-6">
              <div className="align-middle">
                <h3 className="text-3xl text-gray-800 font-bold leading-none mb-3">Lorem ipsum dolor sit amet</h3>
                <p className="text-gray-600 mb-8">
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
