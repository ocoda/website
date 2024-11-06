import { type LoaderFunctionArgs, type MetaFunction, json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { Avatar } from '~/components/avatar/Avatar';
import { LocationIcon } from '~/components/icons';
import Paragraph from '~/components/paragraph/Paragraph';
import SectionTitle from '~/components/section/SectionTitle';
import { i18n } from '~/modules/i18n/i18n.server';
import { type PageMetadata, getDefaultMetaTags, getLocaleMetaTags, getPageMetaTags } from '~/modules/meta';
import type { en } from '~/resources/locales/en';
import { generateImgSrc } from '~/utils/generate-img-src.server';

export async function loader({ request }: LoaderFunctionArgs) {
  const t = await i18n.getFixedT(request, 'dries');
  return json({
    meta: t('meta', { returnObjects: true }) as PageMetadata,
    copy: {
      title: {
        pre: t('title.pre'),
        main: t('title.main'),
      },
      info: {
        location: t('info.location'),
      },
      introduction: t('introduction'),
      expertise: t('expertise', { returnObjects: true }) as (typeof en)['dries']['expertise'],
      experience: t('experience', { returnObjects: true }) as (typeof en)['dries']['experience'],
    },
    images: {
      waves: generateImgSrc({ src: 'waves.svg' }),
      avatar: {
        bg: generateImgSrc({ src: 'avatar_blob.svg' }),
        fg: {
          sm: {
            1: generateImgSrc({ src: 'avatar_content.png', options: { w: 160 } }),
            2: generateImgSrc({ src: 'avatar_content.png', options: { w: 160, dpr: 2 } }),
            3: generateImgSrc({ src: 'avatar_content.png', options: { w: 160, dpr: 3 } }),
          },
          lg: {
            1: generateImgSrc({ src: 'avatar_content.png', options: { w: 224 } }),
            2: generateImgSrc({ src: 'avatar_content.png', options: { w: 224, dpr: 2 } }),
            3: generateImgSrc({ src: 'avatar_content.png', options: { w: 224, dpr: 3 } }),
          },
        },
      },
    },
  });
}

export const meta: MetaFunction<typeof loader> = ({ data, location }) => {
  return [...getDefaultMetaTags(), ...getPageMetaTags(data?.meta), ...getLocaleMetaTags(location.pathname)];
};

export default function Dries() {
  const { copy, images } = useLoaderData<typeof loader>();
  return (
    <>
      <img
        src={images.waves}
        alt="Waves"
        className="mt-28 w-full"
        style={{ transform: 'scale(-1, 1)' }}
        width={300}
        height={29}
      />

      <header className="bg-white px-16 md:px-8">
        <div className="justify-center grid mx-auto -mt-px py-4 container">
          <Avatar images={images.avatar} className="border-shadow mb-2 w-40 lg:w-56 print:w-32" />
          <div className="items-center gap-2 grid text-center text-gray-800">
            <p className="text-xl print:text-lg">{copy.title.pre}</p>
            <h1 className="drop-shadow font-medium text-4xl print:text-3xl">{copy.title.main}</h1>
            <p className="flex justify-center mt-2">
              <LocationIcon className="mr-0.5 w-4 h-4" />{' '}
              <span className="font-light text-sm">{copy.info.location}</span>
            </p>
          </div>
        </div>
      </header>

      <div className="bg-white py-4 md:py-8">
        <div className="mx-auto md:mx-auto max-w-xs sm:max-w-md md:max-w-2xl xl:max-w-5xl print:max-w-2xl container">
          <div className="border-y mx-auto mb-8 py-4 max-w-5xl container">
            <Paragraph weight="normal" size="large" className="text-center">
              {copy.introduction}
            </Paragraph>
          </div>
          <div className="gap-8 print:gap-6 grid grid-cols-1 sm:grid-cols-2">
            {/** Expertise */}
            <section className="gap-y-2 order-1 print:order-3 sm:order-2 grid auto-rows-min break-inside-avoid">
              <SectionTitle>{copy.expertise.title}</SectionTitle>
              <ul>
                {copy.expertise.items.map((item) => (
                  <li key={item} className="my-2">
                    <Paragraph weight="light">{item}</Paragraph>
                  </li>
                ))}
              </ul>
            </section>
            {/** Highlighted experience */}
            <section className="gap-y-2 order-2 sm:order-1 print:hidden grid auto-rows-min break-inside-avoid">
              <SectionTitle>{copy.experience.title.short}</SectionTitle>
              {/* <Timeline experience={copy.experience} /> */}
            </section>
            {/** Skills */}
            {/* <section className="gap-y-2 order-3 md:order-2 print:order-1 grid auto-rows-min break-inside-avoid">
            <SectionTitle>{skills.title}</SectionTitle>
            <Paragraph size="medium" weight="light">
              {skills.description}
            </Paragraph>
            <div className="gap-2.5 grid md:grid-cols-2">
              {skills.items.map(({ category, tools }) => {
                return (
                  <div key={category} className="flex flex-col gap-2">
                    <Paragraph size="medium" weight="normal">
                      {category}
                    </Paragraph>
                    <ul className="flex flex-wrap gap-1">
                      {tools.map((tool) => (
                        <li key={tool.name}>
                          <Paragraph
                            weight="extralight"
                            size="small"
                            className="px-2 py-0.5 border rounded-lg whitespace-nowrap"
                          >
                            {tool.name}
                          </Paragraph>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </section> */}
            {/** Education & Certifications */}
            {/* <section className="gap-y-2 order-4 print:order-2 grid auto-rows-min break-inside-avoid">
            <SectionTitle>{education.title}</SectionTitle>
            <ul className="ml-4 marker:text-green-500 list-disc">
              {education.items.map((item) => (
                <li key={item.title} className="mb-2">
                  <Paragraph size="large">{item.title}</Paragraph>
                  <Paragraph size="small" weight="light" variant="subdued">
                    {item.type} @ {item.organization} | <span className="text-nowrap">{item.date}</span>
                  </Paragraph>
                </li>
              ))}
            </ul>
          </section> */}
            {/** Interests */}
            {/* <section className="gap-y-2 order-5 print:order-4 grid auto-rows-min break-inside-avoid">
            <SectionTitle>{interests.title}</SectionTitle>
            <ul>
              {interests.items.map((item) => (
                <li key={item} className="my-2">
                  <Paragraph weight="extralight">{item}</Paragraph>
                </li>
              ))}
            </ul>
          </section> */}
            {/** Projects */}
            {/* <section className="gap-y-4 order-6 grid sm:col-span-2 auto-rows-min print:mt-16 break-inside-avoid">
            <SectionTitle className="sm:text-center">{projects.title}</SectionTitle>
            <div className="gap-8 grid md:grid-cols-2">
              {projects.items.map((item) => (
                <Link
                  key={item.title}
                  href={item.link}
                  className="flex flex-col gap-2 hover:shadow-md mb-2 px-6 py-4 border rounded-xl transition"
                  target="_blank"
                >
                  <Paragraph size="large">{item.title}</Paragraph>
                  <Paragraph weight="light">{item.description}</Paragraph>
                  <Paragraph size="small" weight="light" variant="subdued">
                    {projects.pre_technologies} {item.technologies.join(', ')}
                  </Paragraph>
                </Link>
              ))}
            </div>
          </section> */}
            {/** Full experience */}
            {/* <section className="gap-y-4 order-7 grid sm:col-span-2 auto-rows-min print:mt-4 break-inside-avoid">
            <SectionTitle className="sm:text-center">{experience.title.full}</SectionTitle>
            <Timeline variation="full" experience={experience} />
          </section> */}
          </div>
          {/* <div className="flex justify-center print:hidden mt-12 break-inside-avoid">
          <section className="flex flex-col items-center gap-3 bg-green-400 -mb-8 px-6 py-4 rounded-xl w-full md:max-w-md outline outline-8 outline-white">
            <SectionTitle className="text-white print:text-green-600">{cta.title}</SectionTitle>
            <div className="gap-3 grid">
              <ContactInfo info={info} />
            </div>
          </section>
        </div> */}
        </div>
      </div>

      <section className="w-full h-60">
        <img
          src={images.waves}
          alt="Waves"
          className="-mt-px w-full"
          style={{ transform: 'scale(1, -1)' }}
          width={300}
          height={29}
        />
      </section>
    </>
  );
}
