import { Grid, Stack } from '@mantine/core';
import { Controller, useFormContext } from 'react-hook-form';
import classNames from 'classnames';

import { Select } from '../Select';
import { Card } from '../Card';
import { Title } from '../Title';

import styles from './Filters.module.scss';
import { DISTRICTS } from 'shared/constants/const';

interface FiltersProps {
  children?: React.ReactNode;
  opened: boolean;
  span?: number;
  tpAddresses?: { value: string; label: string }[];
}

export const Filters = ({
  children,
  opened,
  span,
  tpAddresses,
}: FiltersProps) => {
  const { control } = useFormContext();

  return (
    <Card
      className={classNames(styles.filters, { [styles.hide]: !opened })}
      type="dark"
      p="28px 24px"
    >
      <Stack gap={24}>
        <Title title="Фильтры" level={4} />
        {children ? (
          <Grid gutter={16}>{children}</Grid>
        ) : (
          <Grid gutter={16}>
            <Grid.Col span={span}>
              <Controller
                control={control}
                name="district"
                render={({ field }) => (
                  <Select
                    allowDeselect
                    field={field}
                    data={DISTRICTS}
                    label="Район"
                    placeholder="Выберите район"
                  />
                )}
              />
            </Grid.Col>
            <Grid.Col span={span}>
              <Controller
                control={control}
                name="tpAddress"
                render={({ field }) => (
                  <Select
                    field={field}
                    allowDeselect
                    data={tpAddresses ? tpAddresses : []}
                    label="Ответсвенный тепловой пункт"
                    placeholder="Выберите адрес цтп"
                  />
                )}
              />
            </Grid.Col>
            <Grid.Col span={span}>
              <Controller
                control={control}
                name="events"
                render={({ field }) => (
                  <Select
                    allowDeselect
                    field={field}
                    data={[
                      { value: 'P1 <= 0', label: 'P1 <= 0' },
                      { value: 'P2 <= 0', label: 'P2 <= 0' },
                      { value: 'T1 < min', label: 'T1 < min' },
                      { value: 'T1 > max', label: 'T1 > max' },
                      {
                        value: 'Протечка труб в подъезде',
                        label: 'Протечка труб в подъезде',
                      },
                      {
                        value: 'Сильная течь в системе отопления',
                        label: 'Сильная течь в системе отопления',
                      },
                      {
                        value: 'Температура в квартире ниже нормативной',
                        label: 'Температура в квартире ниже нормативной',
                      },
                      {
                        value:
                          'Температура в помещении общего пользования ниже нормативной',
                        label:
                          'Температура в помещении общего пользования ниже нормативной',
                      },
                      {
                        value: 'Течь в системе отопления',
                        label: 'Течь в системе отопления',
                      },
                    ]}
                    label="Событие"
                    placeholder="Выберите событие"
                  />
                )}
              />
            </Grid.Col>
          </Grid>
        )}
      </Stack>
    </Card>
  );
};
