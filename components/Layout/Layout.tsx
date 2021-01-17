import React, { ReactNode } from 'react';
import styles from './layout.module.scss';
import Head from 'next/head';
import { About } from '../About';
import { Header } from '../Header';

type Props = {
  children: ReactNode
  title?: string
  home?: boolean
}

export const Layout = ({children, title = 'Frontend blog', home = false}: Props) => (
  <div className={styles.layoutContainer}>
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8"/>
      <meta name="viewport" content="initial-scale=1.0, width=device-width"/>
    </Head>
    <div className={styles.header}>
      <Header isHome={home}/>
    </div>
    {home &&
    <div className={styles.about}>
        <About/>
    </div>
    }
    <main>{children}</main>
    <footer>
      <hr/>
      <span>I'm here to stay (Footer)</span>
    </footer>
  </div>
);
