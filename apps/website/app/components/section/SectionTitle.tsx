import type { FC, PropsWithChildren } from 'react';

interface Props extends PropsWithChildren {
  className?: string;
}

const SectionTitle: FC<Props> = ({ children, className }) => {
  const classNames = className?.split(' ') ?? [];
  const classNameValue = [
    'mb-3',
    'font-bold',
    'text-xl',
    'lg:text-2xl',
    'leading-7',
    'text-gray-800',
    ...classNames,
  ].join(' ');

  return <h2 className={classNameValue}>{children}</h2>;
};

export default SectionTitle;
