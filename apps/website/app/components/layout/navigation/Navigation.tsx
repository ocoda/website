import { Link, NavLink } from '@remix-run/react';
import { type ReactElement, useEffect, useState, type FC } from 'react';
import { GithubIcon } from '~/icons/Github';
import { LinkedInIcon } from '~/icons/LinkedIn';
import { OcodaIcon } from '~/icons/Ocoda';

import styles from './navigation.module.css';
import { MailIcon } from '~/icons/Mail';

export const NavBar: FC = () => {
  const [offset, setOffset] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenuClick = () => {
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    const onScroll = () => setOffset(window.scrollY);
    window.removeEventListener('scroll', onScroll);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const websiteLinks: Record<'url' | 'copy', string>[] = [
    { url: '/', copy: 'Home' },
    { url: '/dries', copy: 'Meet Dries' },
  ];

  const socialLinks: { url: string; icon: ReactElement }[] = [
    { url: 'https://github.com/ocoda', icon: <GithubIcon /> },
    { url: 'https://www.linkedin.com/company/ocoda', icon: <LinkedInIcon /> },
    { url: 'mailto:hello@ocoda.be?subject=Hello%20Dries!', icon: <MailIcon /> },
  ];

  return (
    <nav
      id="header"
      className={`fixed w-full z-30 top-0 text-black-950 transition-colors duration-150 ease-in-out ${offset > 10 || menuOpen ? 'bg-white' : ''}`}
    >
      <div className="w-full container mx-auto flex flex-wrap items-center justify-between lg:flex-nowrap mt-0 py-3">
        <div className="pl-4 flex items-center">
          <Link to="/" className="no-underline hover:no-underline text-2xl lg:text-4xl flex items-center font-display">
            <OcodaIcon width={32} height={32} className="mr-4 text-purple-950" />
            <span className="text-transparent bg-ocoda-gradient-inverse bg-clip-text">OCODA</span>
          </Link>
        </div>
        <label className={`${styles.menuButton} ${offset > 10 || menuOpen ? 'text-black-950' : 'text-white'}`}>
          <input type="checkbox" checked={menuOpen} onChange={handleMenuClick} />
          <span />
          <span />
          <span />
        </label>
        <div
          className={`${styles.menu} ${menuOpen ? styles.menuOpen : ''}`}
          // className={`z-20 w-full flex-grow bg-white transition-all lg:flex lg:w-auto lg:items-center lg:bg-transparent lg:p-0 ${offset > 10 || menuOpen ? 'text-black-950' : 'text-white'} ${menuOpen ? 'block p-8' : 'h-0'}`}
        >
          <ul className={`${styles.menuList} ${styles.menuListWebsite}`}>
            {websiteLinks.map(({ url, copy }) => (
              <li key={url}>
                <NavLink
                  to={url}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) => `${isActive ? 'font-bold' : ''}`}
                >
                  {copy}
                </NavLink>
              </li>
            ))}
          </ul>
          <ul className={`${styles.menuList} ${styles.menuListSocial}`}>
            {socialLinks.map(({ url, icon }) => (
              <li key={url}>
                <Link to={url} onClick={() => setMenuOpen(false)} target="_blank" className={styles.socialLink}>
                  {icon}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <hr className="border-b border-gray-100 opacity-25 my-0 py-0" />
    </nav>
  );
};
