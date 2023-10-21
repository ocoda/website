import { Stage } from '../constructs';

export const getDomainName = (stage: Stage) => {
	switch (stage) {
		case Stage.STAGING:
			return 'ocoda.dev';
		case Stage.PRODUCTION:
			return 'ocoda.be';
	}
};
