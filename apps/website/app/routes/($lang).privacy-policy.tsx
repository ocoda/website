import { json, type LoaderFunctionArgs, type MetaFunction } from '@remix-run/node';
import { i18n } from '~/modules/i18n/i18n.server';
import { getDefaultMetaTags, getLocaleMetaTags, getPageMetaTags, type PageMetadata } from '~/modules/meta';

export async function loader({ request }: LoaderFunctionArgs) {
  const t = await i18n.getFixedT(request, 'terms');
  return json({
    meta: t('meta', { returnObjects: true }) as PageMetadata,
    title: t('title'),
    description: t('description'),
  });
}

export const meta: MetaFunction<typeof loader> = ({ data, location }) => {
  return [...getDefaultMetaTags(), ...getPageMetaTags(data?.meta), ...getLocaleMetaTags(location.pathname)];
};

export default function Terms() {
  return (
    <>
      <div>There be privacy here</div>
      <div>There be privacy here</div>
      <div>There be privacy here</div>
      <div>There be privacy here</div>
      <div>There be privacy here</div>
      <div>There be privacy here</div>
      <div>There be privacy here</div>
      <div>There be privacy here</div>
      <div>There be privacy here</div>
      <div>There be privacy here</div>
      <div>There be privacy here</div>
      <div>There be privacy here</div>
      <div>There be privacy here</div>
      <div>There be privacy here</div>
      <div>There be privacy here</div>
      <div>There be privacy here</div>
      <div>There be privacy here</div>
      <div>There be privacy here</div>
      <div>There be privacy here</div>
      <div>There be privacy here</div>
      <div>There be privacy here</div>
      <div>There be privacy here</div>
      <div>There be privacy here</div>
    </>
  );
}
