import React from 'react';
import styles from './postitem.module.scss';
import Link from 'next/link';
import { IPost } from '../../../interfaces/IPost';
import { Date } from '../../Date';

export const PostItem = ({id, date, title, spoiler}: Omit<IPost, 'contentHtml'>) => (
  <li className={styles.postitem}>
    <Link href={`/${id}`}>
      <a className={styles.title}>{title}</a>
    </Link>
    <Date dateString={date}/>
    <p className={styles.spoiler}>{spoiler}</p>
  </li>
);
