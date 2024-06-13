import { Stack } from '@mantine/core';
import { Radio as MantineRadio } from '@mantine/core';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { Card } from 'shared/ui/Card';
import { Radio } from 'shared/ui/Radio';
import { Select } from 'shared/ui/Select';
import { Title } from 'shared/ui/Title';

interface ResponseDrawerProps {
  handleAddObject: () => void;
}

const radios = [
  {
    label: 'P1 <= 0  — Давление на входе в систему отопления внутри объекта',
    value: '1',
  },
  {
    label: 'P2 <= 0 — Давление на выходе в центральную систему отопления',
    value: '2',
  },
  {
    label: 'T1 < min — Температура теплоносителя ',
    value: '3',
  },
];

export const ResponseDrawer = ({ handleAddObject }: ResponseDrawerProps) => {
  const [event, setEvent] = useState('');

  const { control } = useForm();

  return (
    <Stack gap={32}>
      <Stack gap={16}>
        <Controller
          control={control}
          name="type"
          render={({ field }) => (
            <Select
              field={field}
              data={[]}
              label="Тип потребителя"
              placeholder="Выберите тип потребителя"
            />
          )}
        />
        <Controller
          control={control}
          name="type"
          render={({ field }) => (
            <Select
              field={field}
              data={[]}
              label="Объект"
              placeholder="Начните вводить адрес"
            />
          )}
        />
      </Stack>
      <Card type="error" p="24px">
        <Stack gap={8}>
          <Title level={5} title="Часть домов может прогружаться" />
          <p className="text">
            После загрузки нового датасета объекты могут прогружаться. Возможно
            объект, который вы ищите <br /> еще нет в базе
          </p>
        </Stack>
      </Card>
      <Stack gap={16}>
        <Title level={5} title="Событие" />
        <MantineRadio.Group onChange={setEvent} value={event}>
          <Stack gap={8}>
            {radios.map((r) => (
              <Radio key={r.value} value={r.value} label={r.label} />
            ))}
          </Stack>
        </MantineRadio.Group>
      </Stack>
    </Stack>
  );
};
