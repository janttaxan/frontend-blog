import React from 'react';
import styles from './backlink.module.scss';
import Link from 'next/link';

export const BackLink = ({text}: {text: string}) => (
  <Link href='/'>
    <a className={styles.link}>← {text}</a>
  </Link>
);
