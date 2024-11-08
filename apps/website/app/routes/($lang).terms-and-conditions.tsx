import { type LoaderFunctionArgs, type MetaFunction, json } from '@remix-run/node';
import { NavLink, useLoaderData } from '@remix-run/react';
import Paragraph from '~/components/paragraph/Paragraph';
import SectionTitle from '~/components/section/SectionTitle';
import { i18n } from '~/modules/i18n/i18n.server';
import { type PageMetadata, getDefaultMetaTags, getLocaleMetaTags, getPageMetaTags } from '~/modules/meta';
import { WavesIllustration } from '~/resources/illustrations';

export async function loader({ request }: LoaderFunctionArgs) {
  const t = await i18n.getFixedT(request, 'terms');
  return json({
    meta: t('meta', { returnObjects: true }) as PageMetadata,
    copy: {
      title: t('title'),
      sections: {
        introduction: {
          title: t('sections.introduction.title'),
          description: t('sections.introduction.description'),
        },
        websiteUse: {
          title: t('sections.website_use.title'),
          description: t('sections.website_use.description'),
        },
        intellectualProperty: {
          title: t('sections.intellectual_property.title'),
          description: t('sections.intellectual_property.description'),
        },
        disclaimerOfLiability: {
          title: t('sections.disclaimer_of_liability.title'),
          description: t('sections.disclaimer_of_liability.description'),
        },
        governingLaw: {
          title: t('sections.governing_law.title'),
          description: t('sections.governing_law.description'),
        },
        changes: {
          title: t('sections.changes.title'),
          description: t('sections.changes.description', {
            val: new Date('11-08-2024'),
            formatParams: {
              val: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
            },
          }),
        },
        contact: {
          title: t('sections.contact.title'),
          description: t('sections.contact.description'),
        },
      },
    },
  });
}

export const meta: MetaFunction<typeof loader> = ({ data, location }) => {
  return [...getDefaultMetaTags(), ...getPageMetaTags(data?.meta), ...getLocaleMetaTags(location.pathname)];
};

export default function Terms() {
  const { copy } = useLoaderData<typeof loader>();
  return (
    <>
      <WavesIllustration className="mt-32 -mb-px w-full md:h-16 lg:h-32" />
      <div className="bg-white pt-8 md:pt-16 pb-24 md:pb-32">
        <div className="mx-auto max-w-5xl container">
          <h1 className="font-medium text-4xl text-black-900 print:text-3xl">{copy.title}</h1>
          <div className="gap-8 grid mt-16">
            <section>
              <SectionTitle>{copy.sections.introduction.title}</SectionTitle>
              <Paragraph>{copy.sections.introduction.description}</Paragraph>
            </section>
            <section>
              <SectionTitle>{copy.sections.websiteUse.title}</SectionTitle>
              <Paragraph>{copy.sections.websiteUse.description}</Paragraph>
            </section>
            <section>
              <SectionTitle>{copy.sections.intellectualProperty.title}</SectionTitle>
              <Paragraph>{copy.sections.intellectualProperty.description}</Paragraph>
            </section>
            <section>
              <SectionTitle>{copy.sections.disclaimerOfLiability.title}</SectionTitle>
              <Paragraph>{copy.sections.disclaimerOfLiability.description}</Paragraph>
            </section>
            <section>
              <SectionTitle>{copy.sections.governingLaw.title}</SectionTitle>
              <Paragraph>{copy.sections.governingLaw.description}</Paragraph>
            </section>
            <section>
              <SectionTitle>{copy.sections.changes.title}</SectionTitle>
              <Paragraph>{copy.sections.changes.description}</Paragraph>
            </section>
            <section>
              <SectionTitle>{copy.sections.contact.title}</SectionTitle>
              <Paragraph>
                {copy.sections.contact.description} <NavLink to={'mailto:legal@ocoda.be'}>legal@ocoda.be</NavLink>
              </Paragraph>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
