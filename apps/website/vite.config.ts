import { vitePlugin as remix } from '@remix-run/dev';
import type { Preset } from '@remix-run/dev';
import { installGlobals } from '@remix-run/node';
import { AWSProxy, awsPreset } from 'remix-aws';
import { defineConfig } from 'vite';
import { envOnlyMacros } from 'vite-env-only';
import tsconfigPaths from 'vite-tsconfig-paths';

installGlobals();

export default defineConfig({
  plugins: [
    envOnlyMacros(),
    remix({
      serverBuildFile: 'index.mjs',
      presets: [
        awsPreset({
          awsProxy: AWSProxy.APIGatewayV2,
          build: {
            bundle: true,
            minify: true,
            treeShaking: true,
            target: 'node20',
            platform: 'node',
            external: ['aws-sdk', '@aws-sdk'],
          },
        }) as Preset,
      ],
    }),
    tsconfigPaths(),
  ],
  server: { port: 3000 },
});
