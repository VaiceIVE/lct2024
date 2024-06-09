import { Flex } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconAnalyze, IconChevronLeft } from '@tabler/icons-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ITemperatureConditions } from 'shared/models/ITemperatureConditions';
import { Breadcrumbs } from 'shared/ui/Breadcrumbs';
import { Button } from 'shared/ui/Button';
import { PageWrapper } from 'shared/ui/Wrappers/PageWrapper';

import { CreatePredictionCards } from 'widgets/create-prediction-cards';
import { PredictionLeaveModal } from 'widgets/prediction-leave-modal';

import PredictionServices from 'shared/services/PredictionServices';

const CreatePredictionPage = () => {
  const [opened, { open, close }] = useDisclosure(false);

  const navigate = useNavigate();

  const [conditions, setConditions] = useState<ITemperatureConditions[]>([]);
  const [files, setFiles] = useState<File[]>([]);

  const [isLoading, setLoading] = useState(false);

  const handleDeleteFile = (deletedIndex: number) => {
    const filteredArray = files.filter((_, index) => index !== deletedIndex);
    setFiles(filteredArray);
  };

  const handleCreatePrediction = async () => {
    setLoading(true);
    try {
      const id = await PredictionServices.createPrediction(files, conditions);

      navigate(`/prediction/${id}`);
    } catch (error) {
      console.error('Ошибка сети:', error);
    }
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
            onClick={handleCreatePrediction}
            icon={<IconAnalyze width={18} height={18} />}
            disabled={(!conditions.length && !files?.length) || isLoading}
            isLoading={isLoading}
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
      <CreatePredictionCards
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
