import { Drawer as MantineDrawer } from '@mantine/core';
import { useEffect } from 'react';

import styles from './Drawer.module.scss';
import classNames from 'classnames';

interface DraweProps {
  opened: boolean;
  close: () => void;
  title: string;
  children?: React.ReactNode;
  isBlur?: boolean;
  footer?: React.ReactNode;
}

export const Drawer = ({
  opened,
  close,
  title,
  children,
  isBlur,
  footer,
}: DraweProps) => {
  useEffect(() => {
    if (opened) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [opened]);

  return (
    <MantineDrawer.Root
      className={styles.drawer}
      position="right"
      opened={opened}
      onClose={close}
      size={600}
      returnFocus={false}
    >
      <MantineDrawer.Overlay blur={isBlur ? 3 : 0} />
      <MantineDrawer.Content>
        <MantineDrawer.Header>
          <MantineDrawer.Title>
            <div className={styles.title}>{title}</div>
          </MantineDrawer.Title>
          <MantineDrawer.CloseButton />
        </MantineDrawer.Header>
        <MantineDrawer.Body className={classNames(footer && styles.body)}>
          {children}
        </MantineDrawer.Body>
        {footer ? <footer className={styles.footer}>{footer}</footer> : null}
      </MantineDrawer.Content>
    </MantineDrawer.Root>
  );
};
