import { Drawer as MantineDrawer } from '@mantine/core';
import { useEffect } from 'react';

import styles from './Drawer.module.scss';
import { Title } from '../Title';

interface DraweProps {
  opened: boolean;
  close: () => void;
  title: string;
  children?: React.ReactNode;
}

export const Drawer = ({ opened, close, title, children }: DraweProps) => {
  useEffect(() => {
    if (opened) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [opened]);

  return (
    <MantineDrawer
      className={styles.drawer}
      position="right"
      title={<Title level={2} title={title} />}
      opened={opened}
      onClose={close}
      //lockScroll={false}
      size={600}
      overlayProps={{ blur: 3 }}
      returnFocus={false}
    >
      {children}
    </MantineDrawer>
  );
};
