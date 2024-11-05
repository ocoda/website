import type { Options } from '@imgproxy/imgproxy-js-core';
import { generateImageUrl } from '@imgproxy/imgproxy-node';

export type ImgOptions = Options;

interface Props {
  src: string;
  options?: ImgOptions;
}

export const generateImgSrc = ({ src, options }: Props): string => {
  const endpoint = 'https://ocodacdn.dev/image';
  return generateImageUrl({
    endpoint,
    url: { value: `website://${src}` },
    options: { ...options },
  });
};
