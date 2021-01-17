import React from 'react';
import styles from './about.module.scss';

export const About = () => (
  <aside className={styles.about}>
    <img
      className={styles.avatar}
      src='/images/profile-photo.jpg'
      alt='Maxim Frolov'
    />
    <p className={styles.description}>
      Конспекты и заметки <br/>
      на тему frontend разработки.
    </p>
  </aside>
);
