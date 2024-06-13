import { Stack } from '@mantine/core';
import { Card } from 'shared/ui/Card';
import { Title } from 'shared/ui/Title';

export const ResponseDrawer = () => {
  const radios = [];

  return (
    <Stack gap={32}>
      <Stack gap={16}></Stack>
      <Card type="error" p="24px">
        <Stack gap={8}>
          <Title level={5} title="Часть домов еще прогружается" />
          <p className="text">
            После загрузки нового датасета еще не все объекты загрузились.
            Объекта, который вы ищите еще нет в базе
          </p>
        </Stack>
      </Card>
      <Stack gap={16}>
        <Title level={5} title="Событие" />
      </Stack>
    </Stack>
  );
};
