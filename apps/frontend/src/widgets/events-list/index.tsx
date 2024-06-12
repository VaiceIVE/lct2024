import { Flex, Grid, Stack } from '@mantine/core';
import {
  IconDownload,
  IconFilterMinus,
  IconFilterPlus,
} from '@tabler/icons-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { Button } from 'shared/ui/Button';
import { Filters } from 'shared/ui/Filters';
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

  const [isOpen, setOpen] = useState(false);

  const { control, watch } = useForm();

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
        <Grid align="flex-end" gutter={16}>
          <Grid.Col span={6}>
            <Controller
              control={control}
              name="address"
              defaultValue={''}
              render={({ field }) => (
                <Input
                  field={field}
                  label="Поиск"
                  placeholder="Искать по таблице"
                  allowClear
                />
              )}
            />
          </Grid.Col>
          <Grid.Col span={4}>
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
                  label="Поиск"
                  placeholder=""
                />
              )}
            />
          </Grid.Col>
          <Grid.Col span={2}>
            <Flex>
              <Button
                fullWidth
                type="light"
                label="Фильтры"
                onClick={() => setOpen((prev) => !prev)}
                icon={
                  isOpen ? (
                    <IconFilterMinus size={18} />
                  ) : (
                    <IconFilterPlus size={18} />
                  )
                }
              />
            </Flex>
          </Grid.Col>
        </Grid>
        <Filters opened={isOpen}>
          <Grid gutter={16}>
            <Grid.Col span={6}></Grid.Col>
          </Grid>
        </Filters>
        <Table
          data={data.filter((item) =>
            item.address
              .toLowerCase()
              .includes(watch('address')?.toLowerCase() || '')
          )}
        />
      </Stack>
    </WidgetWrapper>
  );
};
