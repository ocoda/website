import type { FC } from 'react';
import { Link } from '@remix-run/react';

export const Footer: FC = () => {
  return (
    <footer className="bg-white border-t text-gray-400 text-sm">
      <div className="container mx-auto px-8 py-4 grid grid-cols-2 items-center">
        <div className="flex flex-col gap-2">
          <span>Ocoda BV</span>
          <span>hello@ocoda.be</span>
          <span>VAT: BE 0123.456.7890</span>
        </div>
        <div className="flex flex-col gap-2 col-start-3 items-end">
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
