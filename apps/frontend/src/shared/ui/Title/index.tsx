import { ReactElement, ReactNode } from 'react';

import styles from './Title.module.scss';

interface TitleProps {
  title: string | ReactNode;
  level?: number;
  color?: string;
}

export const Title = ({ title, level, color }: TitleProps) => {
  let content: ReactElement = <div></div>;

  switch (level) {
    case 1:
      content = (
        <h1
          className={`${styles.title} ${styles.h1}`}
          style={color ? { color } : {}}
        >
          {title}
        </h1>
      );
      break;
    case 2:
      content = (
        <h2
          className={`${styles.title} ${styles.h2}`}
          style={color ? { color: color } : {}}
        >
          {title}
        </h2>
      );
      break;
    case 3:
      content = (
        <h3
          className={`${styles.title} ${styles.h3}`}
          style={color ? { color: color } : {}}
        >
          {title}
        </h3>
      );
      break;
    case 4:
      content = (
        <h4
          className={`${styles.title} ${styles.h4}`}
          style={color ? { color } : {}}
        >
          {title}
        </h4>
      );
      break;
    case 5:
      content = (
        <h5
          className={`${styles.title} ${styles.h5}`}
          style={color ? { color } : {}}
        >
          {title}
        </h5>
      );
      break;
  }

  return content;
};
