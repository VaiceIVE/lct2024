import { Flex, Stack } from '@mantine/core';
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
import { CreatePredictionLoader } from 'widgets/create-prediction-loader';
import { HOME_ROUTE } from 'shared/constants/const';

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
      PredictionServices.createPrediction(files, conditions)
        .then((response) => navigate(`/prediction?id=${response.data}`))
        .catch(() => navigate(HOME_ROUTE));
    } catch (error) {
      console.error('Ошибка сети:', error);
    }
  };

  return (
    <PageWrapper
      isLoading={isLoading}
      button={
        <Flex gap={12}>
          <Button
            type="white"
            isIconLeft
            onClick={open}
            label="Выйти из создания прогнозаа"
            icon={<IconChevronLeft width={18} height={18} />}
          />
          <Button
            label="Анализировать данные"
            onClick={handleCreatePrediction}
            icon={<IconAnalyze width={18} height={18} />}
            disabled={!files?.length || isLoading}
            isLoading={isLoading}
          />
        </Flex>
      }
    >
      {!isLoading ? (
        <Stack gap={40}>
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
        </Stack>
      ) : (
        <CreatePredictionLoader />
      )}
      <PredictionLeaveModal
        title={'Вы уверены, что хотите выйти из создания прогноза?'}
        text={
          'Вы не дождались результатов анализа. Введенные \n данные не сохранятся. Это действие нельзя будет отменить.'
        }
        opened={opened}
        close={close}
      />
    </PageWrapper>
  );
};

export default CreatePredictionPage;
