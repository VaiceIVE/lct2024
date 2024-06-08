import { Flex } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconAnalyze, IconChevronLeft } from '@tabler/icons-react';
import { useState } from 'react';
import { ITemperatureConditions } from 'shared/models/ITemperatureConditions';
import { Breadcrumbs } from 'shared/ui/Breadcrumbs';
import { Button } from 'shared/ui/Button';
import { PageWrapper } from 'shared/ui/Wrappers/PageWrapper';
import { PredictionCreate } from 'widgets/prediction-create';
import { PredictionLeaveModal } from 'widgets/prediction-leave-modal';

const CreatePredictionPage = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [conditions, setConditions] = useState<ITemperatureConditions[]>([]);
  const [files, setFiles] = useState<File[]>([]);

  const handleDeleteFile = (deletedIndex: number) => {
    const filteredArray = files.filter((_, index) => index !== deletedIndex);
    setFiles(filteredArray);
  };

  return (
    <PageWrapper
      button={
        <Flex gap={12}>
          <Button
            type="white"
            isIconLeft
            onClick={open}
            label="Отменить создание прогноза"
            icon={<IconChevronLeft width={18} height={18} />}
          />
          <Button
            label="Анализировать данные"
            icon={<IconAnalyze width={18} height={18} />}
            disabled={!conditions.length && !files?.length}
          />
        </Flex>
      }
    >
      <Breadcrumbs
        onClick={open}
        path={[
          { title: 'Базовый прогноз', href: '/' },
          { title: 'Новый прогноз', href: '/create-prediction' },
        ]}
      />
      <PredictionCreate
        setFiles={setFiles}
        files={files}
        setConditions={setConditions}
        conditions={conditions}
        handleDeleteFile={handleDeleteFile}
      />
      <PredictionLeaveModal opened={opened} close={close} />
    </PageWrapper>
  );
};

export default CreatePredictionPage;
