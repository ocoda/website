import type { Options } from '@imgproxy/imgproxy-js-core';
import { generateImageUrl } from '@imgproxy/imgproxy-node';

interface Props {
  src: string;
  options?: Options;
}

export const generateImgSrc = ({ src, options }: Props) => {
  const endpoint = 'https://ocodacdn.dev/image';
  return generateImageUrl({ endpoint, url: { value: `website://${src}` }, options });
};
