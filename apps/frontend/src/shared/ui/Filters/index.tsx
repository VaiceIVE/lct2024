import { Stack } from '@mantine/core';
import { Card } from '../Card';
import { Title } from '../Title';

import styles from './Filters.module.scss';
import classNames from 'classnames';

interface FiltersProps {
  children: React.ReactNode;
  opened: boolean;
}

export const Filters = ({ children, opened }: FiltersProps) => {
  return (
    <Card
      className={classNames(styles.filters, { [styles.hide]: !opened })}
      type="dark"
      p="28px 24px"
    >
      <Stack gap={24}>
        <Title title="Фильтры" level={4} />
        {children}
      </Stack>
    </Card>
  );
};
