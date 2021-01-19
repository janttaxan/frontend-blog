import React, { useEffect, useState } from 'react';
import styles from './footer.module.scss';

export const Footer = () => {
  const [mounted, setMounted] = useState(false);
  const [currentYear, setCurrentYear] = useState<number>();

  useEffect(() => {
    setMounted(true);
    setCurrentYear(new Date().getFullYear());
  });

  if (!mounted) return null;
  return (
    <footer className={styles.footer}>
      <div className={styles.wrap}>
        <ul className={styles.socialList}>
          <li className={styles.socialItem}>
            <a href="https://telegram.me/janttaxan" target='_blank'>telegram</a>
          </li>
          <li className={styles.socialItem}>
            <a href="https://github.com/janttaxan" target='_blank'>github</a>
          </li>
          <li className={styles.socialItem}>
            <a href="https://career.habr.com/frolovfrontend" target='_blank'>career.habr</a>
          </li>
        </ul>
        <small className={styles.copy}>© {currentYear} Maxim Frolov.</small>
      </div>
    </footer>
  );
};

