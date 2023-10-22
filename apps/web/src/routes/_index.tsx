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
			content: 'Ocoda BV specializes in creating innovative web solutions that make waves in the digital landscape.',
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
			<div className="h-[5%] min-h-24 w-full absolute bottom-0 right-0 bg-purple">
				<div
					className="bg-wave bg-repeat-x absolute h-[198px] -top-[198px] w-[6400px] animate-wave"
					style={{ backgroundImage: `url('${wavePath}')` }}
				/>
				<div
					className="bg-wave bg-repeat-x absolute h-[198px] -top-[175px] w-[6400px] animate-wave-and-swell opacity-1"
					style={{ backgroundImage: `url('${wavePath}')` }}
				/>
			</div>
		</>
	);
}
