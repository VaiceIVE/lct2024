import { Grid, Stack } from '@mantine/core';
import { IconDownload } from '@tabler/icons-react';
import { Button } from 'shared/ui/Button';
import { Input } from 'shared/ui/Input';
import { Select } from 'shared/ui/Select';
import { WidgetWrapper } from 'shared/ui/Wrappers/WidgetWrapper';

export const EventsList = () => {
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
        <Grid gutter={16}>
          <Grid.Col span={8}>
            <Input label="Поиск" placeholder="Искать по таблице" />
          </Grid.Col>
          <Grid.Col span={4}>
            <Select
              data={[
                { value: '1', label: 'От высокого приоритета к низкому' },
                { value: '2', label: 'От низкого приоритета к высокому' },
              ]}
              label="Поиск"
              placeholder=""
            />
          </Grid.Col>
        </Grid>
      </Stack>
    </WidgetWrapper>
  );
};
