import type { MetaFunction } from '@remix-run/node';

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

export default function Terms() {
  return (
    <>
      <div>There be terms and conditions here</div>
    </>
  );
}
