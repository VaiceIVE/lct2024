import { Grid, Stack } from '@mantine/core';
import { Controller, useFormContext } from 'react-hook-form';
import classNames from 'classnames';

import { Select } from '../Select';
import { Card } from '../Card';
import { Title } from '../Title';

import styles from './Filters.module.scss';

interface FiltersProps {
  children?: React.ReactNode;
  opened: boolean;
  span: number;
}

export const Filters = ({ children, opened, span }: FiltersProps) => {
  const { control } = useFormContext();

  return (
    <Card
      className={classNames(styles.filters, { [styles.hide]: !opened })}
      type="dark"
      p="28px 24px"
    >
      <Stack gap={24}>
        <Title title="Фильтры" level={4} />
        <Grid gutter={16}>
          <Grid.Col span={span}>
            <Controller
              control={control}
              name="priority"
              defaultValue={'1'}
              render={({ field }) => (
                <Select
                  field={field}
                  data={[
                    { value: '1', label: 'От высокого приоритета к низкому' },
                    { value: '2', label: 'От низкого приоритета к высокому' },
                  ]}
                  label="Район"
                  placeholder=""
                />
              )}
            />
          </Grid.Col>
          <Grid.Col span={span}>
            <Controller
              control={control}
              name="priority"
              defaultValue={'1'}
              render={({ field }) => (
                <Select
                  field={field}
                  data={[
                    { value: '1', label: 'От высокого приоритета к низкому' },
                    { value: '2', label: 'От низкого приоритета к высокому' },
                  ]}
                  label="Тепловая сеть"
                  placeholder=""
                />
              )}
            />
          </Grid.Col>
          <Grid.Col span={span}>
            <Controller
              control={control}
              name="priority"
              defaultValue={'1'}
              render={({ field }) => (
                <Select
                  field={field}
                  data={[
                    { value: '1', label: 'От высокого приоритета к низкому' },
                    { value: '2', label: 'От низкого приоритета к высокому' },
                  ]}
                  label="Событие"
                  placeholder=""
                />
              )}
            />
          </Grid.Col>
          {/* <Grid.Col span={span}>
            <Controller
              control={control}
              name="priority"
              defaultValue={'1'}
              render={({ field }) => (
                <Select
                  field={field}
                  data={[
                    { value: '1', label: 'От высокого приоритета к низкому' },
                    { value: '2', label: 'От низкого приоритета к высокому' },
                  ]}
                  label="Погодные условия"
                  placeholder=""
                />
              )}
            />
          </Grid.Col> */}
        </Grid>
      </Stack>
    </Card>
  );
};
