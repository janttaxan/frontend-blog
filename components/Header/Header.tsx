import React from 'react';
import Link from 'next/link';
import styles from './header.module.scss';

export const Header = ({isHome = false}: {isHome?: boolean}) => (
  <header className={styles.header}>
    {isHome ? (
      <h2 className={styles.homeLogo}>Frontend blog</h2>
    ) : (
      <Link href='/'>
        <h2 className={styles.postLogo}>Frontend blog</h2>
      </Link>
    )
    }
    <span>themeToggler</span>
  </header>
);
