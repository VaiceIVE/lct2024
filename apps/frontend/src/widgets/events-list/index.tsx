import { Flex, Grid, Stack } from '@mantine/core';
import {
  IconDownload,
  IconFilterMinus,
  IconFilterPlus,
} from '@tabler/icons-react';
import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { IBuilding } from 'shared/models/IBuilding';

import { Button } from 'shared/ui/Button';
import { Filters } from 'shared/ui/Filters';
import { Input } from 'shared/ui/Input';
import { Select } from 'shared/ui/Select';
import { Table } from 'shared/ui/Table';
import { WidgetWrapper } from 'shared/ui/Wrappers/WidgetWrapper';

export const EventsList = () => {
  const data: IBuilding[] = [
    {
      address: 'Новокосинская улица, 32, Москва, 111672',
      events: [
        {
          eventName: 'Сильная течь в системе отопления',
          chance: 20,
          date: '12.06',
        },
        { eventName: 'P1 <= 0', chance: 30, date: '12.06' },
      ],
      socialType: 'МКД',
      coords: [55.717482785, 37.828189394],
      coolingRate: 3,
      consumersCount: null,
      priority: 1,
    },
    {
      address: 'Новокосинская улица, 32, Москва, 111673',
      events: [
        {
          eventName: 'Сильная течь в системе отопления',
          chance: 80,
          date: '12.06',
        },
        { eventName: 'P1 <= 0', chance: 60, date: '12.06' },
      ],
      socialType: 'Здравоохранение',
      coords: [55.717482785, 37.828189394],
      coolingRate: 5,
      consumersCount: null,
      priority: 2,
    },
  ];

  const [isOpen, setOpen] = useState(false);

  const { control, watch } = useFormContext();

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
                  label="Сортировать"
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
        <Filters opened={isOpen} span={6} />
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
