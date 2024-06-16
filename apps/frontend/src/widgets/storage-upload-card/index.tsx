import { Flex, Image, Stack } from '@mantine/core';
import { IconFileUpload } from '@tabler/icons-react';

import { Card } from 'shared/ui/Card';
import { Title } from 'shared/ui/Title';
import { Upload } from 'shared/ui/Upload';
import image from 'shared/assets/bro.svg';

import styles from './StorageUploadCard.module.scss';

interface StorageUploadCardProps {
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  resetRef?: React.ForwardedRef<() => void> | undefined;
}

export const StorageUploadCard = ({
  setFile,
  resetRef,
}: StorageUploadCardProps) => {
  return (
    <Card overflow="hidden">
      <Flex pos={'relative'} w={'100%'}>
        <Stack gap={24}>
          <Stack className={styles.content} w={525} gap={12}>
            <Title level={4} title="Загрузите файл характеристики домов" />
            <p className="text">
              Чтобы расширить базу знаний алгоритма, загрузите сведения <br />о
              домах, характеристики которых еще не известны
            </p>
          </Stack>
          <Upload
            resetRef={resetRef}
            onChange={setFile}
            label="Загрузить файл .xlsx, .xls"
            icon={<IconFileUpload size={18} />}
          />
        </Stack>
        <div className={styles['image-wrapper']}>
          <div className={styles.image}>
            <Image src={image} />
          </div>
        </div>
      </Flex>
    </Card>
  );
};
