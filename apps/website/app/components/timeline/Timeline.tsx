import type { FC } from 'react';
import type { en } from '~/resources/locales/en';
import { CheqroomIcon, DASMediaIcon, MeditechIcon } from '../../resources/icons';
import Paragraph from '../paragraph/Paragraph';
import styles from './timeline.module.css';

interface Props {
  variation?: 'default' | 'full';
  experience: (typeof en)['dries']['experience'];
}

const getIcon = (company: string) => {
  switch (company) {
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
    <div
      className="z-10 flex justify-center items-center bg-white rounded-full ring-2 ring-red-700 ring-inset text-red-700 size-[29px]"
      style={{ gridArea: 'icon' }}
    >
      {getIcon(company)}
    </div>
  );
};

export const Timeline: FC<Props> = ({ experience, variation = 'default' }) => {
  return (
    <ol
      className={`flex flex-col gap-4 relative before:absolute before:ml-3.5 before:w-0.5 before:h-full-extra before:bg-gradient-to-b before:from-red-700 before:from-90% before:to-transparent ${variation === 'full' && styles.full}`}
    >
      {experience.items.map((item) => (
        <li key={item.company} className={`group ${styles.item}`}>
          <TimelineIcon company={item.company} />
          <div className={styles.description}>
            <Paragraph size="large" className={`py-0.5 ${styles.title} moving-color`}>
              {item.role}
            </Paragraph>
            <Paragraph variant="subdued" weight="light" size="small">
              @ {item.company} | {item.period}
            </Paragraph>
            {variation === 'full' && (
              <Paragraph weight="light" size="medium" className="mt-2">
                {item.description}
              </Paragraph>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
};
