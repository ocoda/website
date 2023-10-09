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
					<img src="img/ocoda_logo_full_gradient.svg" alt="Ocoda" />
				</a>
			</h1>
			{/* <div className="absolute flex flex-col bottom-0 left-0 w-full h-1/5">
				<div
					className="place-self-start h-32 w-full bg-repeat-x bg-bottom bg-cover animate-wave"
					style={{ background: 'url(img/wave.svg) repeat-x', transform: 'translate3d(0, 0, 0)' }}
				/>
				<div
					className="place-self-start h-32 w-full bg-repeat-x bg-bottom bg-cover animate-wave"
					style={{ background: 'url(img/wave.svg) repeat-x', transform: 'translate3d(0, 0, 0)' }}
				/>
				<div className="" />
			</div> */}
		</>
	);
}
