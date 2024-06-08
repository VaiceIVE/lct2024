import { Flex, Grid, Stack, useMantineTheme } from '@mantine/core';
import {
  IconCircleCheckFilled,
  IconFileFilled,
  IconFileUpload,
  IconTrashX,
} from '@tabler/icons-react';
import { Card } from 'shared/ui/Card';
import { Title } from 'shared/ui/Title';
import { TemperatureConditions } from './components/temperature-conditions';
import { ITemperatureConditions } from 'shared/models/ITemperatureConditions';
import { Upload } from 'shared/ui/Upload';
import { useRef } from 'react';

interface PredictionCreateProps {
  conditions: ITemperatureConditions[];
  setConditions: React.Dispatch<React.SetStateAction<ITemperatureConditions[]>>;
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  handleDeleteFile: (deletedIndex: number) => void;
}

export const PredictionCreate = ({
  setConditions,
  conditions,
  files,
  setFiles,
  handleDeleteFile,
}: PredictionCreateProps) => {
  const theme = useMantineTheme();

  const resetRef = useRef<() => void>(null);

  return (
    <Grid gutter={16}>
      <Grid.Col span={9}>
        <Card type="outline">
          <Stack gap={28}>
            <Flex align={'center'} gap={12}>
              <Title level={3} title="Территория прогноза" />
              {files.length ? (
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
                onChange={setFiles}
                resetRef={resetRef}
              />
              {files.length ? (
                <Stack gap={12}>
                  <p className="text medium">Загружен файл:</p>
                  {files.map((f, index) => (
                    <Flex key={index} gap={8} align={'center'}>
                      <IconFileFilled
                        color={theme.colors.myBlack[4]}
                        size={18}
                      />
                      <p className="text medium secondary">{f.name}</p>
                      <IconTrashX
                        cursor={'pointer'}
                        onClick={() => {
                          handleDeleteFile(index);
                          resetRef.current?.();
                        }}
                        size={18}
                        color={theme.colors.myState[1]}
                      />
                    </Flex>
                  ))}
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
