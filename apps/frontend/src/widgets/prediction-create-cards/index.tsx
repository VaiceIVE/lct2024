import { Grid } from '@mantine/core';
import { TemperatureConditions } from './components/temperature-conditions';
import { ITemperatureConditions } from 'shared/models/ITemperatureConditions';
import { PredictTerritory } from './components/prediction-territory';

interface PredictionCreateCardProps {
  conditions: ITemperatureConditions[];
  setConditions: React.Dispatch<React.SetStateAction<ITemperatureConditions[]>>;
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  handleDeleteFile: (deletedIndex: number) => void;
}

export const PredictionCreateCards = ({
  setConditions,
  conditions,
  files,
  setFiles,
  handleDeleteFile,
}: PredictionCreateCardProps) => {
  return (
    <Grid gutter={16}>
      <Grid.Col span={9}>
        <PredictTerritory
          files={files}
          setFiles={setFiles}
          handleDeleteFile={handleDeleteFile}
        />
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
