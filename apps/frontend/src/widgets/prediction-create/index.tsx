import { Grid, Stack } from '@mantine/core';
import { IconFileUpload } from '@tabler/icons-react';
import { Button } from 'shared/ui/Button';
import { Card } from 'shared/ui/Card';
import { Title } from 'shared/ui/Title';
import { TemperatureConditions } from './components/temperature-conditions';
import { ITemperatureConditions } from 'shared/models/ITemperatureConditions';

interface PredictionCreateProps {
  conditions: ITemperatureConditions[];
  setConditions: React.Dispatch<React.SetStateAction<ITemperatureConditions[]>>;
}

export const PredictionCreate = ({
  setConditions,
  conditions,
}: PredictionCreateProps) => {
  return (
    <Grid gutter={16}>
      <Grid.Col span={9}>
        <Card type="outline">
          <Stack gap={28}>
            <Title level={3} title="Территория прогноза" />
            <Stack w={679} gap={18}>
              <p className="text medium secondary">
                Вы можете загрузить новый файл с информацией по домам. Наш
                алгоритм проанализирует их и выдаст обновленный прогноз{' '}
              </p>
              <Button
                type="light"
                label="Загрузить файл .xlsx, .xls"
                icon={<IconFileUpload size={18} />}
              />
            </Stack>
          </Stack>
        </Card>
      </Grid.Col>
      <Grid.Col span={9}>
        <TemperatureConditions
          conditions={conditions}
          setConditions={setConditions}
        />
      </Grid.Col>
    </Grid>
  );
};
