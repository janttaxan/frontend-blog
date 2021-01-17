import React from 'react';
import Link from 'next/link';
import styles from './header.module.scss';

const BLOG_NAME = 'Frontend blog.';
export const Header = ({isHome = false}: {isHome?: boolean}) => (
  <header className={styles.header}>
    {isHome ? (
      <h2 className={styles.homeLogo}>{BLOG_NAME}</h2>
    ) : (
      <Link href='/'>
        <h2 className={styles.postLogo}>{BLOG_NAME}</h2>
      </Link>
    )
    }
    <span>theme</span>
  </header>
);
