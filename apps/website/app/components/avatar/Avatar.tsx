import type { FC } from 'react';

interface Props {
  images: {
    bg: string;
    fg: Record<'sm' | 'lg', { 1: string; 2: string; 3: string }>;
  };
}

export const Avatar: FC<Props> = ({ images }) => {
  return (
    <div className="relative image-border-white w-40 lg:w-56 print:w-32">
      {/* biome-ignore lint/a11y/useAltText: Background image */}
      <img src={images.bg} className="top-0 left-0 z-0 absolute" />
      <picture className="relative z-10">
        <source
          media="(max-width: 1023px)"
          srcSet={`${images.fg.sm[1]} 1x, ${images.fg.sm[2]} 2x, ${images.fg.sm[3]} 3x`}
        />
        <img
          src={images.fg.lg[1]}
          srcSet={`${images.fg.lg[1]} 1x, ${images.fg.lg[2]} 2x, ${images.fg.lg[3]} 3x`}
          alt="Avatar Dries Hooghe"
        />
      </picture>
    </div>
  );
};
