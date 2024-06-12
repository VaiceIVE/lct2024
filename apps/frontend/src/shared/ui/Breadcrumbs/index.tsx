import { Flex, Breadcrumbs as MantineBreadcrumbs } from '@mantine/core';
import { IconArrowNarrowLeft } from '@tabler/icons-react';
import { useLocation } from 'react-router-dom';
import classNames from 'classnames';

import styles from './Breadcrumbs.module.scss';

interface BreadcrumbsProps {
  path: { title: string; href: string }[];
  onClick: (path: string) => void;
}

export const Breadcrumbs = ({ path, onClick }: BreadcrumbsProps) => {
  const location = useLocation();

  const items = path.map((item, index) => (
    <div
      onClick={
        location.pathname === item.href ? undefined : () => onClick(item.href)
      }
      key={index}
      className={classNames(styles.crumb, {
        [styles.current]: location.pathname === item.href,
      })}
    >
      {item.title}
    </div>
  ));

  return (
    <Flex className={styles.wrapper} gap={8} align={'center'}>
      <IconArrowNarrowLeft
        onClick={() => onClick(path[0].href)}
        width={24}
        height={24}
      />
      <MantineBreadcrumbs className={styles.breadcrumbs}>
        {items}
      </MantineBreadcrumbs>
    </Flex>
  );
};
