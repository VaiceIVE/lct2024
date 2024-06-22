import { Stack, Flex, Grid } from '@mantine/core';
import { IconFilterMinus, IconFilterPlus } from '@tabler/icons-react';
import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { IBuilding } from 'shared/models/IBuilding';

import { Button } from 'shared/ui/Button';
import { Filters } from 'shared/ui/Filters';
import { Input } from 'shared/ui/Input';
import { Title } from 'shared/ui/Title';
import { PriorityFilter } from 'shared/ui/PriorityFilter';
import { Select } from 'shared/ui/Select';
import { buildingTypesByFilters } from 'shared/constants/buildingTypes';
import { DISTRICTS } from 'shared/constants/const';

import { BuildingItem } from './components/BuildingItem';
import { IObj } from 'shared/models/IResponse';
import { ObjItem } from './components/ObjItem';

interface MapListProps {
  buildings: IBuilding[] | undefined;
  setSelectedBuilding: React.Dispatch<React.SetStateAction<IBuilding | null>>;
  setSelectedObj: React.Dispatch<React.SetStateAction<IObj | null>>;
  buildingsCount: number | undefined;
  objsCount: number | undefined;
  isPriority: boolean;
  setPriority: React.Dispatch<React.SetStateAction<boolean>>;
  isResponse?: boolean;
  objs: IObj[] | undefined;
  tpAddresses?: { value: string; label: string }[];
}

export const MapList = ({
  buildings,
  setSelectedBuilding,
  setSelectedObj,
  buildingsCount,
  setPriority,
  isPriority,
  objsCount,
  isResponse,
  objs,
  tpAddresses,
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
        <Filters tpAddresses={tpAddresses} opened={isOpen}>
          {isResponse ? (
            <>
              <Grid.Col span={12}>
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
              <Grid.Col span={12}>
                <Controller
                  control={control}
                  name="filterSocialType"
                  render={({ field }) => (
                    <Select
                      allowDeselect
                      field={field}
                      data={buildingTypesByFilters}
                      label="Тип объекта"
                      placeholder="Выберите район"
                    />
                  )}
                />
              </Grid.Col>
              <Grid.Col span={12}>
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
            </>
          ) : null}
        </Filters>
      </Stack>
      <Stack gap={24}>
        <Flex justify={'space-between'} align={'center'}>
          <Flex gap={5}>
            <Title level={4} title="События" />
            <Title
              color="gray"
              level={4}
              title={`(${buildingsCount || objsCount})`}
            />
          </Flex>
          <PriorityFilter isPriority={isPriority} setPriority={setPriority} />
        </Flex>
        <p className="text">
          Найдено {buildings?.length ? buildings?.length : objs?.length}
        </p>
        {buildings ? (
          <Stack gap={8}>
            {buildings.map((b) => (
              <BuildingItem
                key={b.address}
                b={b}
                setSelectedBuilding={setSelectedBuilding}
              />
            ))}
          </Stack>
        ) : null}
        {objs ? (
          <Stack gap={8}>
            {objs.map((o) => (
              <ObjItem key={o.address} o={o} setSelectedObj={setSelectedObj} />
            ))}
          </Stack>
        ) : null}
      </Stack>
    </Stack>
  );
};
