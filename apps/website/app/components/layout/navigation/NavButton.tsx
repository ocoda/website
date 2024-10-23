import { NavLink } from '@remix-run/react';
import type { FC } from 'react';

interface Props {
  to: string;
  onClick?: () => void;
  copy: string;
}

export const NavButton: FC<Props> = ({ to, copy, onClick }) => {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) => `block w-full p-4 group no-underline ${isActive ? 'font-bold' : ''}`}
    >
      <span className="group-hover:before:scale-x-100 relative before:-bottom-2 before:absolute lg:before:bg-gray-100 before:opacity-20 before:rounded-sm before:w-full before:h-0.5 before:origin-right before:scale-x-0 group-hover:before:origin-left before:transition-transform duration-300 ease-in-out">
        {copy}
      </span>
    </NavLink>
  );
};
