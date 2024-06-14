import { Stack } from '@mantine/core';
import { Radio as MantineRadio } from '@mantine/core';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { Card } from 'shared/ui/Card';
import { Radio } from 'shared/ui/Radio';
import { Select } from 'shared/ui/Select';
import { Title } from 'shared/ui/Title';

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

export const ResponseDrawer = () => {
  const [event, setEvent] = useState('');

  const { control, watch } = useForm();

  const socialType = watch('socialType') || 'mkd';

  useEffect(() => {
    console.log(socialType);
  }, [socialType]);

  return (
    <Stack gap={32}>
      <Stack gap={16}>
        <Controller
          control={control}
          name="socialType"
          defaultValue={'mkd'}
          render={({ field }) => (
            <Select
              defaultValue={'mkd'}
              field={field}
              data={[
                { value: 'mkd', label: 'МКД' },
                { value: 'education', label: 'Оброзовательное учереждение' },
                { value: 'medicine', label: 'Объект здравоохранения' },
                { value: 'prom', label: 'Прочее' },
              ]}
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
              searchable
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
