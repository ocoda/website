import { type LoaderFunctionArgs, type MetaFunction, json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { Avatar } from '~/components/avatar/Avatar';
import { i18n } from '~/modules/i18n/i18n.server';
import { type PageMetadata, getDefaultMetaTags, getLocaleMetaTags, getPageMetaTags } from '~/modules/meta';
import { generateImgSrc } from '~/utils/generate-img-src.server';

export async function loader({ request }: LoaderFunctionArgs) {
  const t = await i18n.getFixedT(request, 'dries');
  return json({
    meta: t('meta', { returnObjects: true }) as PageMetadata,
    title: t('title'),
    description: t('description'),
    images: {
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
  const { images } = useLoaderData<typeof loader>();
  console.log(images);
  return (
    <>
      <Avatar images={images.avatar} />
      <div>There be Dries here</div>
      <div>There be Dries here</div>
      <div>There be Dries here</div>
      <div>There be Dries here</div>
      <div>There be Dries here</div>
      <div>There be Dries here</div>
      <div>There be Dries here</div>
      <div>There be Dries here</div>
      <div>There be Dries here</div>
      <div>There be Dries here</div>
      <div>There be Dries here</div>
      <div>There be Dries here</div>
      <div>There be Dries here</div>
      <div>There be Dries here</div>
      <div>There be Dries here</div>
      <div>There be Dries here</div>
      <div>There be Dries here</div>
      <div>There be Dries here</div>
      <div>There be Dries here</div>
      <div>There be Dries here</div>
      <div>There be Dries here</div>
      <div>There be Dries here</div>
      <div>There be Dries here</div>
      <div>There be Dries here</div>
      <div>There be Dries here</div>
      <div>There be Dries here</div>
      <div>There be Dries here</div>
    </>
  );
}
