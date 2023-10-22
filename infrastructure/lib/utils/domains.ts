import { Stage } from '../constructs';

export const getApexDomain = (stage: Stage) => {
	switch (stage) {
		case Stage.STAGING:
			return 'ocoda.dev';
		case Stage.PRODUCTION:
			return 'ocoda.be';
	}
};
