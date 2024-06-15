import { Flex, Grid, Stack } from '@mantine/core';
import { IconFileFilled, IconTrashX } from '@tabler/icons-react';

import { Title } from 'shared/ui/Title';

import styles from './StorageFiles.module.scss';

interface StorageFilesProps {
  uploadedFiles: string[];
  handleDeleteUploadedFile: (name: string) => void;
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
          <Grid.Col key={f} span={6}>
            <Flex
              align={'center'}
              justify={'space-between'}
              className={styles.file}
            >
              <Flex style={{ overflow: 'hidden' }} align={'center'} gap={8}>
                <IconFileFilled size={18} />{' '}
                <p
                  style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    textWrap: 'nowrap',
                  }}
                  className="text secondary"
                >
                  {f}
                </p>
              </Flex>
              <IconTrashX
                size={18}
                onClick={() => handleDeleteUploadedFile(f)}
              />
            </Flex>
          </Grid.Col>
        ))}
      </Grid>
    </Stack>
  );
};
