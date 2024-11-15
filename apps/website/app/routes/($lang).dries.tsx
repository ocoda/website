import { type LoaderFunctionArgs, type MetaFunction, json } from '@remix-run/node';
import { NavLink, useLoaderData } from '@remix-run/react';
import { Avatar } from '~/components/avatar/Avatar';
import Paragraph from '~/components/paragraph/Paragraph';
import SectionTitle from '~/components/section/SectionTitle';
import { Skills } from '~/components/skills/Skills';
import { getToolIcon } from '~/components/skills/ToolBadge';
import { Timeline } from '~/components/timeline/Timeline';
import { i18n } from '~/modules/i18n/i18n.server';
import { type PageMetadata, getDefaultMetaTags, getLocaleMetaTags, getPageMetaTags } from '~/modules/meta';
import { LocationIcon } from '~/resources/icons';
import { WavesIllustration } from '~/resources/illustrations';
import type { en } from '~/resources/locales/en';
import { generateImgSrc } from '~/utils/generate-img-src.server';

export async function loader({ request }: LoaderFunctionArgs) {
  const t = await i18n.getFixedT(request, 'dries');
  return json({
    meta: t('meta', { returnObjects: true }) as PageMetadata,
    copy: {
      title: t('title', { returnObjects: true }) as (typeof en)['dries']['title'],
      info: t('info', { returnObjects: true }) as (typeof en)['dries']['info'],
      introduction: t('introduction') as (typeof en)['dries']['introduction'],
      expertise: t('expertise', { returnObjects: true }) as (typeof en)['dries']['expertise'],
      experience: t('experience', { returnObjects: true }) as (typeof en)['dries']['experience'],
      skills: t('skills', { returnObjects: true }) as (typeof en)['dries']['skills'],
      education: t('education', { returnObjects: true }) as (typeof en)['dries']['education'],
      interests: t('interests', { returnObjects: true }) as (typeof en)['dries']['interests'],
      projects: t('projects', { returnObjects: true }) as (typeof en)['dries']['projects'],
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
      <WavesIllustration className="mt-32 w-full md:h-16 lg:h-32" />

      <header className="bg-white px-16 md:px-8">
        <div className="justify-items-center grid mx-auto -mt-px py-4 container">
          <Avatar images={images.avatar} className="border-shadow mb-2 w-40 lg:w-56 print:w-32" />
          <div className="items-center gap-2 grid text-center text-gray-800">
            <p className="text-xl print:text-lg">{copy.title.pre}</p>
            <h1 className="font-medium text-4xl print:text-3xl">{copy.title.main}</h1>
            <p className="flex justify-center mt-2">
              <LocationIcon className="mr-0.5 w-4 h-4 text-red-700" />{' '}
              <span className="font-light text-sm">{copy.info.location}</span>
            </p>
          </div>
        </div>
      </header>

      <div className="bg-white pt-4 md:pt-8 pb-24 md:pb-32">
        <div className="mx-auto max-w-5xl container">
          <div className="border-y mx-auto mb-8 py-4 max-w-5xl container">
            <Paragraph weight="normal" size="large" className="text-center">
              {copy.introduction}
            </Paragraph>
          </div>
          <div className="gap-8 print:gap-6 grid grid-cols-1 md:grid-cols-2 p-4 lg:p-0">
            {/** Expertise */}
            <section className="order-1 md:order-2 print:order-3 grid auto-rows-min break-inside-avoid">
              <SectionTitle>{copy.expertise.title}</SectionTitle>
              <ul>
                {copy.expertise.items.map((item) => (
                  <li key={item} className="my-2">
                    <Paragraph weight="light">{item}</Paragraph>
                  </li>
                ))}
              </ul>
            </section>
            {/** Interests */}
            <section className="order-5 md:order-3 print:order-4 grid auto-rows-min break-inside-avoid">
              <SectionTitle>{copy.interests.title}</SectionTitle>
              <ul>
                {copy.interests.items.map((item) => (
                  <li key={item} className="my-2">
                    <Paragraph weight="extralight">{item}</Paragraph>
                  </li>
                ))}
              </ul>
            </section>
            {/** Highlighted experience */}
            <section className="order-2 md:order-1 print:hidden grid md:row-span-2 auto-rows-min mb-4 break-inside-avoid">
              <SectionTitle>{copy.experience.title.short}</SectionTitle>
              <Timeline experience={copy.experience} />
            </section>
            {/** Skills */}
            <section className="order-3 md:order-3 print:order-1 grid md:col-span-2 auto-rows-min break-inside-avoid">
              <SectionTitle>{copy.skills.title}</SectionTitle>
              <Paragraph size="medium" weight="light" className="mb-2">
                {copy.skills.description}
              </Paragraph>
              <Skills skills={copy.skills.items} />
            </section>
            {/** Education & Certifications */}
            <section className="order-4 print:order-2 grid md:row-span-2 auto-rows-min break-inside-avoid">
              <SectionTitle>{copy.education.title}</SectionTitle>
              <ul className="ml-4 marker:text-gray-600 list-disc">
                {copy.education.items.map((item) => (
                  <li key={item.title} className="mb-2">
                    <Paragraph size="large">{item.title}</Paragraph>
                    <Paragraph size="small" weight="light" variant="subdued">
                      {item.type} @ {item.organization} | <span className="text-nowrap">{item.date}</span>
                    </Paragraph>
                  </li>
                ))}
              </ul>
            </section>
            {/** Projects */}
            <section className="order-6 grid auto-rows-min print:mt-16 break-inside-avoid">
              <SectionTitle>{copy.projects.title}</SectionTitle>
              <div className="gap-4 grid">
                {copy.projects.items.map((item) => (
                  <NavLink
                    key={item.title}
                    to={item.link}
                    className="flex flex-col gap-2 hover:shadow-md px-6 py-4 border rounded-xl transition"
                    target="_blank"
                    rel="noreferrer nofollow"
                  >
                    <Paragraph size="large" weight="bold">
                      {item.title}
                    </Paragraph>
                    <Paragraph weight="light">{item.description}</Paragraph>
                    <Paragraph size="small" weight="light" variant="subdued" className="mt-2">
                      {copy.projects.pre_technologies}
                    </Paragraph>
                    <div className="flex items-center gap-2">
                      {item.technologies.map((tech) => (
                        <span key={tech}>{getToolIcon(tech)}</span>
                      ))}
                    </div>
                  </NavLink>
                ))}
              </div>
            </section>
            {/** Full experience */}
            <section className="order-7 grid md:col-span-2 auto-rows-min print:mt-4 break-inside-avoid">
              <SectionTitle className="sm:text-center">{copy.experience.title.full}</SectionTitle>
              <Timeline experience={copy.experience} full />
            </section>
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
    </>
  );
}
