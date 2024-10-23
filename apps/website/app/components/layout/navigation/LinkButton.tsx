import { NavLink } from '@remix-run/react';
import type { FC, ReactElement } from 'react';

interface Props {
  to: string;
  onClick?: () => void;
  icon: ReactElement;
}

export const LinkButton: FC<Props> = ({ to, icon, onClick }) => {
  return (
    <NavLink to={to} onClick={onClick} className="block p-4 w-full no-underline group" target="_blank">
      <span className="group-hover:*:scale-110 *:transition-transform *:duration-300 *:ease-in-out *:scale-100">
        {icon}
      </span>
    </NavLink>
  );
};
