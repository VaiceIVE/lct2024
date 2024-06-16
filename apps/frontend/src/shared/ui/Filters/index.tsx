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
              name="district"
              render={({ field }) => (
                <Select
                  allowDeselect
                  field={field}
                  data={[
                    {
                      value: 'муниципальный округ Преображенское',
                      label: 'Округ Преображенское',
                    },
                    {
                      value: 'муниципальный округ Восточный',
                      label: 'Округ Восточный',
                    },
                    {
                      value: 'муниципальный округ Гольяново',
                      label: 'Округ Гольяново',
                    },
                    {
                      value: 'муниципальный округ Перово',
                      label: 'Округ Перово',
                    },
                    {
                      value: 'муниципальный округ Новокосино',
                      label: 'Округ Новокосино',
                    },
                    {
                      value: 'муниципальный округ Богородское',
                      label: 'Округ Богородское',
                    },
                    {
                      value: 'муниципальный округ Новогиреево',
                      label: 'Округ Новогиреево',
                    },
                    {
                      value: 'муниципальный округ Вешняки',
                      label: 'Округ Вешняки',
                    },
                    {
                      value: 'муниципальный округ Метрогородок',
                      label: 'Округ Метрогородок',
                    },
                    {
                      value: 'муниципальный округ Соколиная Гора',
                      label: 'Округ Соколиная Гора',
                    },
                    {
                      value: 'муниципальный округ Ивановское',
                      label: 'Округ Ивановское',
                    },
                    {
                      value: 'муниципальный округ Измайлово',
                      label: 'Округ Измайлово',
                    },
                    {
                      value: 'муниципальный округ Сокольники',
                      label: 'Округ Сокольники',
                    },
                    {
                      value: 'муниципальный округ Северное Измайлово',
                      label: 'Округ Северное Измайлово',
                    },
                    {
                      value: 'муниципальный округ Восточное Измайлово',
                      label: 'Округ Восточное Измайлово',
                    },
                    {
                      value: 'муниципальный округ Косино-Ухтомский',
                      label: 'Округ Косино-Ухтомский',
                    },
                  ]}
                  label="Район"
                  placeholder="Выберите район"
                />
              )}
            />
          </Grid.Col>
          <Grid.Col span={span}>
            <Controller
              control={control}
              name="networkType"
              render={({ field }) => (
                <Select
                  field={field}
                  allowDeselect
                  data={[
                    { value: 'ctp', label: 'ЦТП' },
                    { value: 'tp', label: 'ИТП' },
                  ]}
                  label="Тепловая сеть"
                  placeholder="Выберите тип тепловой сети"
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
