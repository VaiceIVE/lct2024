import { Flex, Drawer as MantineDrawer } from '@mantine/core';
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
  position?: 'left' | 'right';
  closeIcon?: React.ReactNode;
  closeOnClickOutside?: boolean;
  overlayZIndex?: number;
  returnIcon?: React.ReactNode;
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
  position = 'right',
  closeIcon,
  closeOnClickOutside = true,
  overlayZIndex,
  returnIcon,
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
      position={position}
      opened={opened}
      onClose={close}
      size={600}
      returnFocus={false}
      autoFocus={false}
      closeOnClickOutside={closeOnClickOutside}
    >
      <MantineDrawer.Overlay
        zIndex={overlayZIndex}
        blur={isBlur ? 3 : 0}
        backgroundOpacity={backgroundOpacity}
      />
      <MantineDrawer.Content>
        <MantineDrawer.Header>
          <Flex gap={12}>
            {withCloseButton && !returnIcon ? (
              <MantineDrawer.CloseButton icon={closeIcon} autoFocus={false} />
            ) : null}
            {returnIcon ? returnIcon : null}
            <MantineDrawer.Title>
              <div className={styles.title}>{title}</div>
            </MantineDrawer.Title>
          </Flex>
          {returnIcon ? (
            <MantineDrawer.CloseButton icon={closeIcon} autoFocus={false} />
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
