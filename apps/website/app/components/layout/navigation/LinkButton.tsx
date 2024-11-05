import { NavLink } from '@remix-run/react';
import type { FC, ReactElement } from 'react';

interface Props {
  title: string;
  to: string;
  onClick?: () => void;
  icon: ReactElement;
}

export const LinkButton: FC<Props> = ({ title, to, icon, onClick }) => {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className="block p-4 w-full no-underline cursor-pointer group"
      target="_blank"
      title={title}
    >
      <span className="group-hover:*:scale-110 *:transition-transform *:duration-300 *:ease-in-out *:scale-100">
        {icon}
      </span>
    </NavLink>
  );
};
