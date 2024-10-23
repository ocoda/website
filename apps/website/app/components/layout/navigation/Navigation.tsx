import { Link, NavLink } from '@remix-run/react';
import { useEffect, useMemo, useState, type FC } from 'react';
import { GithubIcon } from '~/icons/Github';
import { LinkedInIcon } from '~/icons/LinkedIn';
import { OcodaIcon } from '~/icons/Ocoda';
import { MailIcon } from '~/icons/Mail';
import { NavButton } from './NavButton';
import { LinkButton } from './LinkButton';
import { MenuButton } from './MenuButton';

export const NavBar: FC = () => {
  const [offset, setOffset] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenuClick = () => setMenuOpen((prevState) => !prevState);
  const handleLinkClick = () => setMenuOpen(false);

  // Memoize static website and social links to avoid re-creation on every render
  const websiteLinks = useMemo(
    () => [
      { url: '/', copy: 'Home' },
      { url: '/dries', copy: 'Meet Dries' },
    ],
    [],
  );

  const socialLinks = useMemo(
    () => [
      { url: 'https://github.com/ocoda', icon: <GithubIcon /> },
      { url: 'https://www.linkedin.com/company/ocoda', icon: <LinkedInIcon /> },
      { url: 'mailto:hello@ocoda.be?subject=Hello%20Dries!', icon: <MailIcon /> },
    ],
    [],
  );

  // Handle scroll events
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
    >
      <div className="grid grid-cols-[1fr_max-content] mx-auto px-6 py-4 container">
        <div className="flex items-center">
          <Link to="/" className="flex items-center font-display text-2xl lg:text-4xl no-underline hover:no-underline">
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
