import { Flex, Grid, Stack } from '@mantine/core';
import { IconFilterMinus, IconFilterPlus } from '@tabler/icons-react';
import { IObj } from 'shared/models/IResponse';
import { Button } from 'shared/ui/Button';
import { WidgetWrapper } from 'shared/ui/Wrappers/WidgetWrapper';

import { PriorityFilter } from 'shared/ui/PriorityFilter';
import { useState } from 'react';
import { ResponseItem } from './components/response-item';
import { Filters } from 'shared/ui/Filters';
import { Controller, useFormContext } from 'react-hook-form';
import { Select } from 'shared/ui/Select';
import { DISTRICTS } from 'shared/constants/const';
import { buildingTypesByFilters } from 'shared/constants/buildingTypes';

interface ResponseListProps {
  obj: IObj[] | undefined;
  isPriority: boolean;
  setPriority: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedObj: React.Dispatch<React.SetStateAction<IObj | null>>;
  date: string | undefined;
}

export const ResponseList = ({
  obj,
  isPriority,
  setPriority,
  setSelectedObj,
  date,
}: ResponseListProps) => {
  const [isFiltersOpen, setFiltersOpen] = useState(false);

  const { control } = useFormContext();

  return (
    <WidgetWrapper
      title="События по приоритету "
      button={
        <Flex gap={24} align={'center'}>
          <PriorityFilter setPriority={setPriority} isPriority={isPriority} />
          <Button
            fullWidth
            type="light"
            label="Фильтры"
            onClick={() => setFiltersOpen((prev) => !prev)}
            icon={
              isFiltersOpen ? (
                <IconFilterMinus size={18} />
              ) : (
                <IconFilterPlus size={18} />
              )
            }
          />
        </Flex>
      }
    >
      <Filters opened={isFiltersOpen}>
        <Grid.Col span={6}>
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
        <Grid.Col span={6}>
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
      </Filters>
      {obj?.length ? (
        <Stack gap={8}>
          {obj &&
            obj.map((o, index) => (
              <ResponseItem
                date={date}
                key={index}
                setSelectedObj={setSelectedObj}
                index={index}
                o={o}
              />
            ))}
        </Stack>
      ) : (
        <Stack justify="center">
          <div>Ничего не найдено</div>
        </Stack>
      )}
    </WidgetWrapper>
  );
};
