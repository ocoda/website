import * as esbuild from 'esbuild';

await esbuild.build({
  entryPoints: ['./app/lambda/index.ts'],
  bundle: true,
  minify: true,
  treeShaking: true,
  target: 'node20',
  platform: 'node',
  tsconfig: './tsconfig.lambda.json',
  external: ['aws-sdk', '@aws-sdk'],
  outfile: './build/lambda/index.js',
});
