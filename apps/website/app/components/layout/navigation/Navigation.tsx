import { Link } from '@remix-run/react';
import { useEffect, useMemo, useRef, useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { GithubIcon, LinkedInIcon, MailIcon, OcodaIcon } from '~/components/icons';
import { ensureLocalizedURL } from '~/modules/i18n/resources';
import { useClickOutside } from '~/utils/use-click-outside';
import { LanguageSelector } from './LanguageSelector';
import { LinkButton } from './LinkButton';
import { MenuButton } from './MenuButton';
import { NavButton } from './NavButton';

export const NavBar: FC = () => {
  const { t, i18n } = useTranslation('common', { keyPrefix: 'nav' });

  const ref = useRef(null);
  const [offset, setOffset] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenuClick = () => setMenuOpen((prevState) => !prevState);
  const handleLinkClick = () => setMenuOpen(false);

  useClickOutside(ref, () => setMenuOpen(false));

  const websiteLinks = useMemo(
    () => [
      { url: ensureLocalizedURL('/', i18n.language), copy: t('home') },
      { url: ensureLocalizedURL('/dries', i18n.language), copy: t('dries') },
    ],
    [i18n.language, t],
  );

  const socialLinks = useMemo(
    () => [
      { url: 'https://github.com/ocoda', icon: <GithubIcon /> },
      { url: 'https://www.linkedin.com/company/ocoda', icon: <LinkedInIcon /> },
      { url: 'mailto:hello@ocoda.be?subject=Hello%20Dries!', icon: <MailIcon /> },
    ],
    [],
  );

  useEffect(() => {
    const onScroll = () => setOffset(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      id="header"
      className={`fixed w-full z-30 top-0 text-black-950 transition-colors duration-150 ease-in-out ${
        offset > 10 || menuOpen ? 'bg-white' : ''
      }`}
      ref={ref}
    >
      <div className="grid grid-cols-[1fr_max-content] mx-auto px-6 py-4 container">
        <div className="flex items-center">
          <Link
            to={`/${i18n.language}`}
            className="flex items-center font-display text-2xl lg:text-4xl no-underline hover:no-underline"
          >
            <OcodaIcon width={32} height={32} className="mr-4 text-purple-950" />
            <span className="bg-clip-text bg-ocoda-gradient-inverse text-transparent">OCODA</span>
          </Link>
        </div>
        <MenuButton isOpen={menuOpen} isScrolling={offset > 10} onToggle={handleMenuClick} />
        <div
          data-menu-open={menuOpen}
          data-is-scrolling={offset > 10}
          className="z-20 lg:flex data-[menu-open=true]:col-span-2 w-full max-h-0 data-[menu-open=true]:max-h-dvh lg:max-h-none text-white data-[is-scrolling=true]:text-black-950 data-[menu-open=true]:text-black-950"
        >
          <ul
            data-menu-open={menuOpen}
            className="text-right lg:flex items-center hidden data-[menu-open=true]:grid mt-4 lg:mt-0 text-lg"
          >
            {websiteLinks.map(({ url, copy }) => (
              <li key={url}>
                <NavButton to={url} onClick={handleLinkClick} copy={copy} />
              </li>
            ))}
          </ul>
          <div
            data-menu-open={menuOpen}
            className="text-right lg:flex justify-end items-center hidden data-[menu-open=true]:grid text-lg"
          >
            <LanguageSelector />
          </div>
          <ul
            data-menu-open={menuOpen}
            className="text-right lg:flex justify-end items-center hidden data-[menu-open=true]:grid data-[menu-open=true]:grid-flow-col text-lg"
          >
            {socialLinks.map(({ url, icon }) => (
              <li key={url}>
                <LinkButton to={url} icon={icon} />
              </li>
            ))}
          </ul>
        </div>
      </div>
      <hr className="border-gray-100 opacity-25 my-0 py-0 border-b" />
    </nav>
  );
};
