import { Flex, Breadcrumbs as MantineBreadcrumbs } from '@mantine/core';
import { IconArrowNarrowLeft } from '@tabler/icons-react';
import { useLocation } from 'react-router-dom';
import classNames from 'classnames';

import styles from './Breadcrumbs.module.scss';

interface BreadcrumbsProps {
  path: { title: string; href: string }[];
  onClick: () => void;
}

export const Breadcrumbs = ({ path, onClick }: BreadcrumbsProps) => {
  const location = useLocation();

  const items = path.map((item, index) => (
    <div
      onClick={location.pathname === item.href ? undefined : onClick}
      key={index}
      className={classNames(
        styles.crumb,
        location.pathname === item.href && styles.current
      )}
    >
      {item.title}
    </div>
  ));

  return (
    <Flex className={styles.wrapper} gap={8} align={'center'}>
      <IconArrowNarrowLeft onClick={onClick} width={24} height={24} />
      <MantineBreadcrumbs className={styles.breadcrumbs}>
        {items}
      </MantineBreadcrumbs>
    </Flex>
  );
};
