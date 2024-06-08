import { Flex, Grid, Stack, useMantineTheme } from '@mantine/core';
import {
  IconCircleCheckFilled,
  IconFileFilled,
  IconFileUpload,
} from '@tabler/icons-react';
import { Card } from 'shared/ui/Card';
import { Title } from 'shared/ui/Title';
import { TemperatureConditions } from './components/temperature-conditions';
import { ITemperatureConditions } from 'shared/models/ITemperatureConditions';
import { Upload } from 'shared/ui/Upload';

interface PredictionCreateProps {
  conditions: ITemperatureConditions[];
  setConditions: React.Dispatch<React.SetStateAction<ITemperatureConditions[]>>;
  file: File | null;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
}

export const PredictionCreate = ({
  setConditions,
  conditions,
  file,
  setFile,
}: PredictionCreateProps) => {
  const theme = useMantineTheme();

  return (
    <Grid gutter={16}>
      <Grid.Col span={9}>
        <Card type="outline">
          <Stack gap={28}>
            <Flex align={'center'} gap={12}>
              <Title level={3} title="Территория прогноза" />
              {file ? (
                <IconCircleCheckFilled
                  color={theme.colors.myBlue[1]}
                  size={24}
                />
              ) : null}
            </Flex>
            <Stack w={679} gap={18}>
              <p className="text medium secondary">
                Вы можете загрузить новый файл с информацией по домам. Наш
                алгоритм проанализирует их и выдаст обновленный прогноз{' '}
              </p>
              <Upload
                type="light"
                label="Загрузить файл .xlsx, .xls"
                icon={<IconFileUpload size={18} />}
                onChange={setFile}
              />
              {file ? (
                <Stack gap={12}>
                  <p className="text medium">Загружен файл:</p>
                  <Flex gap={8} align={'center'}>
                    <IconFileFilled color={theme.colors.myBlack[4]} size={18} />
                    <p className="text medium secondary">{file.name}</p>
                  </Flex>
                </Stack>
              ) : null}
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
