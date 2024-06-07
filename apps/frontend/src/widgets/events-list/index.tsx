import { Grid, Stack } from '@mantine/core';
import { IconDownload } from '@tabler/icons-react';
import { Controller, useForm } from 'react-hook-form';

import { Button } from 'shared/ui/Button';
import { Input } from 'shared/ui/Input';
import { Select } from 'shared/ui/Select';
import { Table } from 'shared/ui/Table';
import { WidgetWrapper } from 'shared/ui/Wrappers/WidgetWrapper';

type test = {
  type: string;
  address: string;
  chance: number;
  date: string;
  event: string;
  cooling: string;
};

export const EventsList = () => {
  const data: test[] = [
    {
      type: '1',
      address: 'Новокосинская ул., 24Б, Москва',
      chance: 97,
      date: '12.06',
      event: 'Прорыв трубы',
      cooling: '2',
    },
    {
      type: '1',
      address: '123123 ул., 24Б, Москва',
      chance: 20,
      date: '12.10',
      event: 'Прор2323ыв трубы',
      cooling: '221',
    },
    {
      type: '1',
      address:
        'Новокос12312инская ул., 24Б, Москваул., 24Б, Москва Новокос12312инская ул., 24Б, Москваул., 24Б, Москва',
      chance: 65,
      date: '12.12',
      event: 'Прорыв трубы',
      cooling: '2',
    },
    {
      type: '1',
      address: 'Новокосинская ул., 24Б, Москва',
      chance: 18,
      date: '12.06',
      event: '123 трубы',
      cooling: '2123',
    },
    {
      type: '1',
      address: 'Новокосинская ул., 24Б, Москва',
      chance: 97,
      date: '12.06',
      event: 'Прорыв трубы',
      cooling: '2',
    },
    {
      type: '1',
      address: '123123 ул., 24Б, Москва',
      chance: 20,
      date: '12.10',
      event: 'Прор2323ыв трубы',
      cooling: '221',
    },
    {
      type: '1',
      address:
        'Новокос12312инская ул., 24Б, Москваул., 24Б, Москва Новокос12312инская ул., 24Б, Москваул., 24Б, Москва',
      chance: 65,
      date: '12.12',
      event: 'Прорыв трубы',
      cooling: '2',
    },
    {
      type: '1',
      address: 'Новокосинская ул., 24Б, Москва',
      chance: 18,
      date: '12.06',
      event: '123 трубы',
      cooling: '2123',
    },
    {
      type: '1',
      address: '123123 ул., 24Б, Москва',
      chance: 20,
      date: '12.10',
      event: 'Прор2323ыв трубы',
      cooling: '221',
    },
    {
      type: '1',
      address:
        'Новокос12312инская ул., 24Б, Москваул., 24Б, Москва Новокос12312инская ул., 24Б, Москваул., 24Б, Москва',
      chance: 65,
      date: '12.12',
      event: 'Прорыв трубы',
      cooling: '2',
    },
    {
      type: '1',
      address: 'Новокосинская ул., 24Б, Москва',
      chance: 18,
      date: '12.06',
      event: '123 трубы',
      cooling: '2123',
    },
    {
      type: '1',
      address: 'Новокосинская ул., 24Б, Москва',
      chance: 97,
      date: '12.06',
      event: 'Прорыв трубы',
      cooling: '2',
    },
    {
      type: '1',
      address: '123123 ул., 24Б, Москва',
      chance: 20,
      date: '12.10',
      event: 'Прор2323ыв трубы',
      cooling: '221',
    },
    {
      type: '1',
      address:
        'Новокос12312инская ул., 24Б, Москваул., 24Б, Москва Новокос12312инская ул., 24Б, Москваул., 24Б, Москва',
      chance: 65,
      date: '12.12',
      event: 'Прорыв трубы',
      cooling: '2',
    },
    {
      type: '1',
      address: 'Новокосинская ул., 24Б, Москва',
      chance: 18,
      date: '12.06',
      event: '123 трубы',
      cooling: '2123',
    },
  ];

  const { control } = useForm();

  return (
    <WidgetWrapper
      button={
        <Button
          label="Скачать таблицу"
          icon={<IconDownload width={18} height={18} />}
          type="light"
        />
      }
      title="Список событий"
    >
      <Stack gap={24}>
        <Grid gutter={16}>
          <Grid.Col span={8}>
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <Input
                  field={field}
                  label="Поиск"
                  placeholder="Искать по таблице"
                />
              )}
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <Controller
              control={control}
              name="priority"
              render={({ field }) => (
                <Select
                  field={field}
                  data={[
                    { value: '1', label: 'От высокого приоритета к низкому' },
                    { value: '2', label: 'От низкого приоритета к высокому' },
                  ]}
                  label="Поиск"
                  placeholder=""
                />
              )}
            />
          </Grid.Col>
        </Grid>
        <Table data={data} />
      </Stack>
    </WidgetWrapper>
  );
};
