import { IconHome } from '@tabler/icons-react';

import styles from './IconBlock.module.scss';

interface IconBlockProps {
  iconType: string;
  color?: string;
}

export const IconBlock = ({ iconType, color }: IconBlockProps) => {
  const typeIcons: { [key: string]: JSX.Element } = {
    '1': <IconHome width={24} height={24} className={styles.orange} />,
  };

  return <div className={styles.icon}>{typeIcons[`${iconType}`]}</div>;
};
