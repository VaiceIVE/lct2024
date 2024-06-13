import { Stack, Flex } from '@mantine/core';
import { IconFilterMinus, IconFilterPlus } from '@tabler/icons-react';
import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { IBuilding } from 'shared/models/IBuilding';

import { Button } from 'shared/ui/Button';
import { Card } from 'shared/ui/Card';
import { Filters } from 'shared/ui/Filters';
import { IconBlock } from 'shared/ui/IconBlock';
import { Input } from 'shared/ui/Input';
import { Title } from 'shared/ui/Title';

import styles from './MapList.module.scss';

interface MapListProps {
  buildings: IBuilding[] | undefined;
  setSelectedBuilding: React.Dispatch<React.SetStateAction<IBuilding | null>>;
  buildingsCount: number | undefined;
}

export const MapList = ({
  buildings,
  setSelectedBuilding,
  buildingsCount,
}: MapListProps) => {
  const [isOpen, setOpen] = useState(false);

  const { control } = useFormContext();

  return (
    <Stack gap={40}>
      <Stack gap={16}>
        <Flex w={'100%'} justify={'space-between'} align={'flex-end'} gap={16}>
          <Controller
            control={control}
            name="address"
            defaultValue={''}
            render={({ field }) => (
              <Input
                w={'100%'}
                field={field}
                placeholder="Искать по таблице"
                allowClear
              />
            )}
          />
          <Button
            type="light"
            onClick={() => setOpen((prev) => !prev)}
            w={57}
            icon={
              isOpen ? (
                <IconFilterMinus size={18} />
              ) : (
                <IconFilterPlus size={18} />
              )
            }
          />
        </Flex>
        <Filters opened={isOpen} span={12} />
      </Stack>
      <Stack gap={24}>
        <Flex gap={3}>
          <Title level={4} title="События" />
          <Title color="gray" level={4} title={`(${buildingsCount})`} />
        </Flex>
        <p className="text">Найдено {buildings?.length}</p>
        <Stack gap={8}>
          {buildings &&
            buildings.map((b) => (
              <Card
                className={styles.building}
                onClick={() => setSelectedBuilding(b)}
                key={b.address}
                p="20px"
                type="dark"
              >
                <Flex align={'center'} gap={24}>
                  <Flex align={'center'} gap={16}>
                    <IconBlock iconType={b.socialType} />
                    <Stack gap={7}>
                      <p className="text medium">{b.address}</p>
                      <p className="text">
                        {b.events.map((e) => e.eventName).join(', ')}
                      </p>
                    </Stack>
                  </Flex>
                </Flex>
              </Card>
            ))}
        </Stack>
      </Stack>
    </Stack>
  );
};
