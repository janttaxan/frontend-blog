import React from 'react';
import styles from './postitem.module.scss';
import Link from 'next/link';
import { IPost } from '../../../interfaces';
import { Date } from '../../Date';

export const PostItem = ({id, date, title}: Omit<IPost, 'contentHtml'>) => (
  <li className={styles.postitem} key={id}>
    <Link href={`/${id}`}>
      <a className={styles.title}>{title}</a>
    </Link>
    <Date dateString={date}/>
  </li>
);
