/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Flex, Grid, Stack } from '@mantine/core';
import {
  IconDownload,
  IconFilterMinus,
  IconFilterPlus,
} from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { IBuilding } from 'shared/models/IBuilding';
import FileServices from 'shared/services/FilesServices';

import { Button } from 'shared/ui/Button';
import { Filters } from 'shared/ui/Filters';
import { Input } from 'shared/ui/Input';
import { Select } from 'shared/ui/Select';
import { Table } from 'shared/ui/Table';
import { WidgetWrapper } from 'shared/ui/Wrappers/WidgetWrapper';

interface EventsListProps {
  id: string | (string | null)[] | null;
  month: string;
  data: IBuilding[];
}

export const EventsList = ({ id, month, data }: EventsListProps) => {
  const [isOpen, setOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const [tpAddresses, setTpAddresses] = useState<
    { value: string; label: string }[]
  >([]);

  const { control, watch } = useFormContext();

  const isPriority = watch('priority') || '1';

  const getDataByFilters = () => {
    return data
      .sort((a, b) =>
        isPriority === '1' ? b.priority - a.priority : a.priority - b.priority
      )
      .filter((item) =>
        item.address
          .toLowerCase()
          .includes(watch('address')?.toLowerCase() || '')
      )
      .filter((b) => !watch('district') || b.district === watch('district'))
      .filter(
        (b) => !watch('networkType') || b.networkType === watch('networkType')
      )
      .filter(
        (b) =>
          !watch('events') ||
          b.events.map((e) => e.eventName).includes(watch('events'))
      );
  };

  const handleDownloadTable = () => {
    setLoading(true);
    FileServices.downloadTable(`${id}`, month).then(() => setLoading(false));
  };

  useEffect(() => {
    const getUniqueAddresses = (items: IBuilding[]) => {
      return Array.from(
        new Set(
          items
            .filter((item) => item.connectionInfo?.address)
            .map((item) => ({
              value: item.connectionInfo!.address!,
              label: item.connectionInfo!.address!,
            }))
        )
      );
    };

    if (data?.length) {
      const uniqTp = getUniqueAddresses(data);
      console.log('uniqTp', uniqTp);
      setTpAddresses(uniqTp);
    }
  }, [data]);

  return (
    <WidgetWrapper
      button={
        <Button
          label="Скачать таблицу"
          icon={<IconDownload width={18} height={18} />}
          type="light"
          onClick={handleDownloadTable}
          disabled={isLoading}
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
                  placeholder="Выберите приоритет"
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
                isActive={Boolean(
                  Object.values(watch()).filter((e) => e).length
                )}
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
        <Filters tpAddresses={tpAddresses} opened={isOpen} span={6} />
        <Stack gap={16}>
          <p className="text medium placeholder">
            Найдено результатов: {getDataByFilters().length}
          </p>
          <Table data={getDataByFilters()} />
        </Stack>
      </Stack>
    </WidgetWrapper>
  );
};
