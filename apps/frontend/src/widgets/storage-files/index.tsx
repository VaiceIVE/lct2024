import { Flex, Grid, Stack } from '@mantine/core';
import { IconFileFilled, IconTrashX } from '@tabler/icons-react';

import { IFile } from 'shared/models/IFiles';
import { Title } from 'shared/ui/Title';

import styles from './StorageFiles.module.scss';

interface StorageFilesProps {
  uploadedFiles: IFile[];
  handleDeleteUploadedFile: (id: number) => void;
  isLoading: boolean;
}

export const StorageFiles = ({
  uploadedFiles,
  handleDeleteUploadedFile,
  isLoading,
}: StorageFilesProps) => {
  return (
    <Stack gap={24}>
      <Flex gap={5}>
        <Title level={3} title={'Загруженные файлы'} />{' '}
        <Title color="gray" level={3} title={`(${uploadedFiles.length})`} />
      </Flex>
      <Grid gutter={16}>
        {uploadedFiles.map((f) => (
          <Grid.Col key={f.id} span={6}>
            <Flex
              align={'center'}
              justify={'space-between'}
              className={styles.file}
            >
              <Flex align={'center'} gap={8}>
                <IconFileFilled size={18} />{' '}
                <p className="text secondary">{f.name}</p>
              </Flex>
              <IconTrashX
                size={18}
                onClick={() => handleDeleteUploadedFile(f.id)}
              />
            </Flex>
          </Grid.Col>
        ))}
      </Grid>
    </Stack>
  );
};
