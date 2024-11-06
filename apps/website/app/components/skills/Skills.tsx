import type { FC } from 'react';
import type { en } from '~/resources/locales/en';
import Paragraph from '../paragraph/Paragraph';
import { ToolBadge } from './ToolBadge';

interface Props {
  skills: (typeof en)['dries']['skills']['items'];
}

export const Skills: FC<Props> = ({ skills }) => {
  return (
    <div className="gap-4 grid md:grid-cols-2">
      {skills.map(({ category, tools }) => {
        return (
          <div key={category} className="flex flex-col gap-2">
            <Paragraph size="medium" weight="normal">
              {category}
            </Paragraph>
            <ul className="flex flex-wrap gap-1">
              {tools.map((tool) => (
                <li key={tool.name}>
                  <ToolBadge tool={tool} />
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
};
