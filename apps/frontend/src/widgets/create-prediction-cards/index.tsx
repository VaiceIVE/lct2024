import { Flex, Grid, useMantineTheme } from '@mantine/core';
import { TemperatureConditions } from './components/temperature-conditions';
import { ITemperatureConditions } from 'shared/models/ITemperatureConditions';
import { PredictTerritory } from './components/prediction-territory';
import { Card } from 'shared/ui/Card';
import { IconCircleCheckFilled } from '@tabler/icons-react';

interface CreatePredictionCardsProps {
  conditions: ITemperatureConditions[];
  setConditions: React.Dispatch<React.SetStateAction<ITemperatureConditions[]>>;
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  handleDeleteFile: (deletedIndex: number) => void;
}

export const CreatePredictionCards = ({
  setConditions,
  conditions,
  files,
  setFiles,
  handleDeleteFile,
}: CreatePredictionCardsProps) => {
  const theme = useMantineTheme();

  return (
    <Grid gutter={16}>
      <Grid.Col span={9}>
        <PredictTerritory
          files={files}
          setFiles={setFiles}
          handleDeleteFile={handleDeleteFile}
        />
      </Grid.Col>
      <Grid.Col span={3}>
        <Card type="error" p="16px 18px">
          <Flex gap={16} align={'flex-start'}>
            <IconCircleCheckFilled color={theme.colors.myState[1]} size={24} />
            <p className="text error">
              Для нового прогноза введите данные как минимум в один блок
            </p>
          </Flex>
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
