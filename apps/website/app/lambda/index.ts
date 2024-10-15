import { createRequestHandler } from './create-request-handler';

const build = require('../../build/server');

export const handler = createRequestHandler({ build });
