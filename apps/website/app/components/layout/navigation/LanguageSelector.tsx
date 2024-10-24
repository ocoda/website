import { Link, useLocation } from '@remix-run/react';
import { useRef, useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useChangeLanguage } from 'remix-i18next/react';
import { ChevronDownIcon } from '~/icons/ChevronDown';
import { ensureLocalizedURL } from '~/modules/i18n/resources';
import { supportedLanguages } from '~/modules/i18n/resources';
import { useClickOutside } from '~/utils/use-click-outside';

export const LanguageSelector: FC = () => {
  const ref = useRef(null);
  const { pathname } = useLocation();
  const { i18n } = useTranslation();
  const selectedLng = i18n.language;

  const [menuOpen, setMenuOpen] = useState(false);
  useClickOutside(ref, () => setMenuOpen(false));

  const handleMenuClick = () => setMenuOpen((prevState) => !prevState);

  return (
    <>
      <button
        className="relative items-center gap-2 grid grid-cols-2 bg-transparent p-4 cursor-pointer group"
        aria-label="Language selector"
        type="button"
        onClick={handleMenuClick}
        ref={ref}
      >
        <span>{selectedLng.toUpperCase()}</span>
        <ChevronDownIcon className="w-5 h-5 transition-transform group-hover:animate-bounce" />
        <div
          data-menu-open={menuOpen}
          className="top-[80%] right-5 z-10 absolute border-2 hidden data-[menu-open=true]:grid bg-white shadow-md border-red-600 rounded-md w-24 text-black-950 overflow-hidden"
        >
          {supportedLanguages.map((lng) => (
            <Link
              key={lng}
              to={ensureLocalizedURL(pathname, lng)}
              className={`transition-colors ease-in-out px-6 py-2 hover:text-red-600 ${selectedLng === lng ? 'bg-red-600 hover:text-white text-white' : ''}`}
              onClick={() => useChangeLanguage(lng)}
            >
              {lng.toUpperCase()}
            </Link>
          ))}
        </div>
      </button>
    </>
  );
};
