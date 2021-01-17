import React from 'react';
import styles from './footer.module.scss';

export const Footer = () => (
  <footer className={styles.footer}>
    <div className={styles.wrap}>
      <ul className={styles.socialList}>
        <li className={styles.socialItem}>
          <a href="https://telegram.me/desserped" target='_blank'>telegram</a>
        </li>
        <li className={styles.socialItem}>
          <a href="https://github.com/FrolovFrontend" target='_blank'>github</a>
        </li>
        <li className={styles.socialItem}>
          <a href="https://career.habr.com/frolovfrontend" target='_blank'>career.habr</a>
        </li>
      </ul>
      <small className={styles.copy}>© 2021 Maxim Frolov.</small>
    </div>
  </footer>
);
