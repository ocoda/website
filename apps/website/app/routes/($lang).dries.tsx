import type { MetaFunction } from '@remix-run/node';
import { getLocaleMetaTags } from '~/modules/i18n/resources';

export const meta: MetaFunction = ({ location }) => {
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
    ...getLocaleMetaTags(location.pathname),
  ];
};

export default function Dries() {
  return (
    <>
      <div>There be Dries here</div>
    </>
  );
}
