import { IconAlertTriangle } from '@tabler/icons-react';
import { Card } from '../Card';
import { CloseIcon, Flex } from '@mantine/core';

import styles from './Notice.module.scss';
import classNames from 'classnames';
import { useEffect, useState } from 'react';

interface NoticeProps {
  message: string;
  type: 'error' | 'done';
  close: () => void;
  isPageNotice?: boolean;
  w?: number;
  children?: React.ReactNode;
}

export const Notice = ({
  message,
  type,
  close,
  isPageNotice,
  w,
  children,
}: NoticeProps) => {
  const [isFade, setFade] = useState(false);

  const types = {
    error: {
      color: 'orange',
      bg: '#FFE4DE',
      icon: <IconAlertTriangle size={24} />,
    },
    done: {
      color: 'orange',
      bg: '#EEF6FC',
      icon: <IconAlertTriangle size={24} />,
    },
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setFade(true);
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      isFade && close();
    }, 500);

    return () => clearTimeout(timeout);
  }, [isFade, close]);

  return (
    <Card
      className={classNames(styles.notice, styles[types[type].color], {
        [styles.fade]: isFade,
        [styles.page]: isPageNotice,
      })}
      w={w}
      bg={types[type].bg}
      p="16px 18px"
    >
      {children ? (
        children
      ) : (
        <Flex justify={'space-between'} align={'center'}>
          <Flex gap={16}>
            {types[type].icon} <div className={styles.message}>{message}</div>
          </Flex>
          <CloseIcon onClick={close} cursor={'pointer'} size="24px" />
        </Flex>
      )}
    </Card>
  );
};
