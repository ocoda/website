import type { FC } from 'react';

export const Footer: FC = () => {
  return (
    <footer className="bg-white border-t text-gray-400 text-sm">
      <div className="container mx-auto px-8 py-4 grid md:grid-cols-3 items-center">
        <div className="flex flex-col gap-2">
          <span>Ocoda BV</span>
          <span>hello@ocoda.be</span>
          <span>VAT: BE 0123.456.7890</span>
        </div>
        <div>Links</div>
        <div className="flex flex-col gap-2">
          <span>Terms & Conditions</span>
          <span>Privacy Policy</span>
          <span>Illustrations by GetIllustrations</span>
          <span>Image by </span>
        </div>
      </div>
    </footer>
  );
};
