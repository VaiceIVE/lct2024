import { Flex, Grid, Stack } from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import { Card } from 'shared/ui/Card';
import { Title } from 'shared/ui/Title';

import styles from './PredictionCards.module.scss';
import { NavLink } from 'react-router-dom';
import { STORAGE_ROUTE } from 'shared/constants/const';
import { StatCard } from 'shared/ui/StatCard';
import { IBuilding } from 'shared/models/IBuilding';
import { useEffect, useState } from 'react';
import HistoryServices from 'shared/services/HistoryServices';

interface PredictionCardsProps {
  isLoading: boolean;
  buildings: IBuilding[] | undefined;
}

export const PredictionCards = ({
  isLoading,
  buildings,
}: PredictionCardsProps) => {
  const [historyLen, setHistoryLen] = useState<number>(0);

  const getHistory = () => {
    HistoryServices.getHistory().then((response) =>
      setHistoryLen(response.data.length)
    );
  };

  useEffect(() => {
    getHistory();
  }, []);

  return (
    <Grid gutter={18}>
      <Grid.Col span={6}>
        <StatCard isLoading={isLoading} obj={buildings} />
      </Grid.Col>
      <Grid.Col span={6}>
        <Card h={'100%'} type="dark">
          <Stack h={'100%'}>
            <Stack flex={1} gap={8}>
              <Title level={3} title="История прогнозов" />
              <p className="text secondary">
                {historyLen} продвинутых прогнозов сделано за все время <br />{' '}
                использования сервиса
              </p>
            </Stack>
            <NavLink to={STORAGE_ROUTE}>
              <Flex className={styles.flex} gap={8} align={'center'}>
                <p className="text medium link">Открыть историю в Хранилище</p>
                <IconChevronRight size={20} />
              </Flex>
            </NavLink>
          </Stack>
        </Card>
      </Grid.Col>
    </Grid>
  );
};
