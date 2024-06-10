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
  backgroundOpacity?: number;
  withCloseButton?: boolean;
  isFooterBorder?: boolean;
}

export const Drawer = ({
  opened,
  close,
  title,
  children,
  isBlur,
  footer,
  backgroundOpacity,
  withCloseButton = true,
  isFooterBorder = true,
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
      autoFocus={false}
    >
      <MantineDrawer.Overlay
        blur={isBlur ? 3 : 0}
        backgroundOpacity={backgroundOpacity}
      />
      <MantineDrawer.Content>
        <MantineDrawer.Header>
          <MantineDrawer.Title>
            <div className={styles.title}>{title}</div>
          </MantineDrawer.Title>
          {withCloseButton ? (
            <MantineDrawer.CloseButton autoFocus={false} />
          ) : null}
        </MantineDrawer.Header>
        <MantineDrawer.Body className={classNames({ [styles.body]: footer })}>
          {children}
        </MantineDrawer.Body>
        {footer ? (
          <footer
            className={classNames(styles.footer, {
              [styles.border]: isFooterBorder,
            })}
          >
            {footer}
          </footer>
        ) : null}
      </MantineDrawer.Content>
    </MantineDrawer.Root>
  );
};
