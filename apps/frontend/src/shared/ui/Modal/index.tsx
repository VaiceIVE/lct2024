import { Modal as MantineModal } from '@mantine/core';
import { useEffect } from 'react';

import styles from './Modal.module.scss';
import { Title } from '../Title';

interface ModalProps {
  opened: boolean;
  close: () => void;
  title: string;
  children: React.ReactNode;
  w?: number;
}

export const Modal = ({ opened, close, title, children, w }: ModalProps) => {
  useEffect(() => {
    if (opened) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [opened]);

  return (
    <MantineModal
      size={w}
      autoFocus={false}
      className={styles.modal}
      opened={opened}
      onClose={close}
      title={<Title level={3} title={title} />}
      centered
    >
      {children}
    </MantineModal>
  );
};
