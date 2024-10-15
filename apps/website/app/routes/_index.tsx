import type { MetaFunction } from '@remix-run/node';

import logoPath from '../images/ocoda_logo_full_gradient.svg';
import wavePath from '../images/wave.svg';

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
			<h1 className="self-center w-2/3 max-w-[640px] my-auto">
				<a href="mailto:hello@ocoda.be">
					<img src={logoPath} alt="Ocoda" />
				</a>
			</h1>
		</>
	);
}
