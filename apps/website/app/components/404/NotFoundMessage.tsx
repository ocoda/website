import { NavLink } from '@remix-run/react';
import type { FC } from 'react';

import notFoundImage from '~/assets/images/404.gif';

interface Props {
  error: unknown;
}

export const NotFoundMessage: FC<Props> = ({ error }) => {
  console.error(error);
  return (
    <div className="w-full h-dvh grid container justify-center items-center mx-auto">
      <div className="flex flex-col gap-8 items-center">
        <img
          src={notFoundImage}
          alt="Moss from the IT crowd looking at the fire in his office"
          className="rounded-md"
        />
        <div className="font-display">You got lost - exclamation mark, exclamation mark</div>
        <NavLink
          to="/"
          className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          Let's get back to safety
        </NavLink>
      </div>
    </div>
  );
};
