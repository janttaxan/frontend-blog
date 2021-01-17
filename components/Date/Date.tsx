import React from 'react';
import styles from './date.module.scss';
import { parseISO, format } from 'date-fns';
import ruLocale from 'date-fns/locale/ru';

export const Date = ({dateString}: {dateString: string}) => {
  const date = parseISO(dateString);

  return (
    <time className={styles.date} dateTime={dateString}>
      {format(
        date,
        'd MMMM, yyyy',
        {locale: ruLocale},
      )}
    </time>
  );
};
