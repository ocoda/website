import { NavLink } from '@remix-run/react';
import type { FC } from 'react';

interface Props {
  error: unknown;
  to: string;
}

export const NotFoundMessage: FC<Props> = ({ to }) => {
  return (
    <div className="justify-center items-center grid mx-auto w-full h-dvh container">
      <div className="flex flex-col items-center gap-8">
        <div className="font-display">You got lost - exclamation mark, exclamation mark</div>
        <NavLink
          to={to}
          className="bg-white hover:bg-gray-50 shadow-sm px-3.5 py-2.5 rounded-md ring-1 ring-gray-300 ring-inset font-semibold text-gray-900 text-sm"
        >
          Let's get back to safety
        </NavLink>
      </div>
    </div>
  );
};
