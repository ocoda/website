import type { Options } from '@imgproxy/imgproxy-js-core';
import { generateImageUrl } from '@imgproxy/imgproxy-node';
import type { FC, HTMLAttributes } from 'react';

interface Props extends Omit<HTMLAttributes<HTMLImageElement>, 'src' | 'alt'> {
  src: string;
  alt: string;
  options?: Options;
}

export const Img: FC<Props> = ({ src, alt, options, ...rest }) => {
  const endpoint = 'https://ocodacdn.dev/image';
  const newSrc = generateImageUrl({ endpoint, url: { value: `website://${src}` }, options });
  return <img {...rest} src={newSrc} alt={alt} />;
};
