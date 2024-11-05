import type { FC, HTMLProps } from 'react';

interface Props {
  images: {
    bg: string;
    fg: Record<'sm' | 'lg', { 1: string; 2: string; 3: string }>;
  };
}

export const Avatar: FC<Props & HTMLProps<HTMLDivElement>> = ({ images, ...rest }) => {
  return (
    <div {...rest}>
      <picture className="relative z-10">
        <source
          media="(max-width: 1023px)"
          srcSet={`${images.fg.sm[1]} 1x, ${images.fg.sm[2]} 2x, ${images.fg.sm[3]} 3x`}
        />
        <img
          src={images.fg.lg[1]}
          srcSet={`${images.fg.lg[1]} 1x, ${images.fg.lg[2]} 2x, ${images.fg.lg[3]} 3x`}
          alt="Avatar Dries Hooghe"
          style={{ backgroundImage: `url(${images.bg})` }}
          className="bg-cover bg-no-repeat"
        />
      </picture>
    </div>
  );
};
