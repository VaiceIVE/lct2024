import classNames from 'classnames';
import {
  IconAmbulance,
  IconBuildingFactory,
  IconHome,
} from '@tabler/icons-react';

import styles from './IconBlock.module.scss';
import { Tooltip } from '@mantine/core';

interface IconBlockProps {
  iconType: string;
  color?: string;
  tooltip?: string;
}

export const IconBlock = ({ iconType, tooltip, color }: IconBlockProps) => {
  const sizes = {
    width: 24,
    height: 24,
  };

  const typeIcons: { [key: string]: { icon: JSX.Element; color: string } } = {
    МКД: {
      icon: <IconHome {...sizes} className={styles.orange} />,
      color: 'orange',
    },
    Здравоохранение: {
      icon: <IconAmbulance {...sizes} className={styles.blue} />,
      color: 'blue',
    },
    '3': {
      icon: <IconBuildingFactory {...sizes} className={styles.black} />,
      color: 'gray',
    },
  };

  const element = (
    <div
      className={classNames(
        styles.icon,
        styles[typeIcons[`${iconType}`].color]
      )}
    >
      {typeIcons[`${iconType}`].icon}
    </div>
  );

  return tooltip ? (
    <Tooltip
      className={styles.tooltip}
      arrowOffset={100}
      arrowPosition="center"
      arrowSize={8}
      withArrow
      label={tooltip}
    >
      {element}
    </Tooltip>
  ) : (
    element
  );
};
