import type { FC } from 'react';
import type { en } from '~/resources/locales/en';
import { CheqroomIcon, DASMediaIcon, MeditechIcon, OcodaSimpleIcon } from '../../resources/icons';
import Paragraph from '../paragraph/Paragraph';

interface Props {
  full?: boolean;
  experience: (typeof en)['dries']['experience'];
}

const getIcon = (company: string) => {
  switch (company) {
    case 'Ocoda':
      return <OcodaSimpleIcon className="size-[15px]" />;
    case 'Cheqroom':
      return <CheqroomIcon className="size-[15px]" />;
    case 'DAS Media':
      return <DASMediaIcon className="size-[15px]" />;
    case 'Meditech':
      return <MeditechIcon className="size-[15px]" />;
  }
};

const TimelineIcon: FC<{ company: string }> = ({ company }) => {
  return (
    <div className="z-10 flex justify-center items-center [grid-area:icon] bg-white rounded-full ring-2 ring-red-700 ring-inset text-red-700 size-[29px]">
      {getIcon(company)}
    </div>
  );
};

export const Timeline: FC<Props> = ({ experience, full }) => {
  return (
    <ol className="relative flex flex-col gap-4 data-[full]:lg:gap-0 group/root" data-full={full}>
      <span className="group-data-[full]/root:lg:ml-[calc(50%_-_0.125rem)] absolute bg-gradient-to-b from-90% from-red-700 to-transparent ml-3.5 w-0.5 h-full-offset-4 group-data-[full]/root:lg:translate-x-1/2" />
      {experience.items.map((item) => (
        <li
          key={item.period}
          data-full={full}
          className="relative gap-4 grid grid-cols-[auto_1fr] data-[full]:lg:grid-cols-[1fr_auto_1fr] [grid-template-areas:'icon_content'] data-[full]:lg:odd:[grid-template-areas:'content_icon_.'] data-[full]:lg:even:[grid-template-areas:'._icon_content'] group/item"
        >
          <TimelineIcon company={item.company} />
          <div
            data-full={full}
            className="data-[full]:lg:group-odd/item:text-right flex flex-col data-[full]:lg:group-odd/item:items-end [grid-area:content] group/content"
          >
            <Paragraph size="large" className="inline relative py-0.5 w-max">
              {item.role}
            </Paragraph>
            <Paragraph variant="subdued" weight="light" size="small" className="inline w-max">
              @ {item.company} | {item.period}
            </Paragraph>
            <Paragraph weight="light" size="medium" className="group-data-[full]/content:inline hidden mt-2">
              {item.description}
            </Paragraph>
          </div>
        </li>
      ))}
    </ol>
  );
};
