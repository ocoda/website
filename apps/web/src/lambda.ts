import { createRequestHandler } from '@remix-run/architect';

const build = require('../build/server');

export const handler = createRequestHandler({ build });
