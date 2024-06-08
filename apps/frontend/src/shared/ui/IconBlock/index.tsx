import classNames from 'classnames';
import { IconBuildingFactory, IconHome } from '@tabler/icons-react';

import styles from './IconBlock.module.scss';

interface IconBlockProps {
  iconType: string;
  color?: string;
}

export const IconBlock = ({ iconType, color }: IconBlockProps) => {
  const sizes = {
    width: 24,
    height: 24,
  };

  const typeIcons: { [key: string]: { icon: JSX.Element; color: string } } = {
    '1': {
      icon: <IconHome {...sizes} className={styles.orange} />,
      color: 'orange',
    },

    '3': {
      icon: <IconBuildingFactory {...sizes} className={styles.black} />,
      color: 'gray',
    },
  };

  return (
    <div
      className={classNames(
        styles.icon,
        styles[typeIcons[`${iconType}`].color]
      )}
    >
      {typeIcons[`${iconType}`].icon}
    </div>
  );
};
