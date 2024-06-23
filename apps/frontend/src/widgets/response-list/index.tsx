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
import { useDisclosure } from '@mantine/hooks';
import { Modal } from 'shared/ui/Modal';

interface ResponseListProps {
  obj: IObj[] | undefined;
  isPriority: boolean;
  setPriority: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedObj: React.Dispatch<React.SetStateAction<IObj | null>>;
  date: string | undefined;
  setDeletedId: React.Dispatch<React.SetStateAction<number | undefined>>;
  handleDeleteObject: () => void;
  tpAddresses?: { value: string; label: string }[];
}

export const ResponseList = ({
  obj,
  isPriority,
  setPriority,
  setSelectedObj,
  date,
  setDeletedId,
  handleDeleteObject,
  tpAddresses,
}: ResponseListProps) => {
  const [isFiltersOpen, setFiltersOpen] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);

  const { control, watch } = useFormContext();

  const onOpen = (id: number) => {
    setDeletedId(id);
    open();
  };

  const onClose = () => {
    handleDeleteObject();
    close();
  };

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
      <Filters tpAddresses={tpAddresses} opened={isFiltersOpen}>
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
                onOpen={onOpen}
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
      <Modal
        w={557}
        title="Вы уверены, что хотите завершить инцидент?"
        opened={opened}
        close={close}
      >
        <Stack gap={18}>
          <p className="text">
            После изменения статуса инцидент исчезнет из списка, вернуть его
            будет можно лишь создав заново
          </p>
          <Flex gap={7}>
            <Button fullWidth label="Отменить" onClick={close} />
            <Button
              fullWidth
              label="Завершить инцидент"
              type="white"
              onClick={onClose}
            />
          </Flex>
        </Stack>
      </Modal>
    </WidgetWrapper>
  );
};
