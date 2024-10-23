import type { FC } from 'react';
import { Link } from '@remix-run/react';

export const Footer: FC = () => {
  return (
    <footer className="bg-white border-t text-gray-400 text-sm">
      <div className="items-center grid grid-cols-2 mx-auto px-8 py-4 container">
        <div className="flex flex-col gap-2">
          <span>Ocoda BV</span>
          <span>hello@ocoda.be</span>
          <span>VAT: BE 0123.456.7890</span>
        </div>
        <div className="flex flex-col items-end gap-2 col-start-3">
          <span>Terms & Conditions</span>
          <span>Privacy Policy</span>
          <span>
            Illustrations from{' '}
            <Link to={'https://www.reshot.com'} target="_blank">
              Reshot
            </Link>
          </span>
        </div>
      </div>
    </footer>
  );
};
