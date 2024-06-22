import { Flex, Grid, Loader, Stack, useMantineTheme } from '@mantine/core';
import { useEffect, useState } from 'react';
import { IconArrowRight } from '@tabler/icons-react';
import { NavLink } from 'react-router-dom';
import classNames from 'classnames';

import { PREDICTION_ROUTE, STORAGE_ROUTE } from 'shared/constants/const';
import { IHistory } from 'shared/models/IHistory';
import { Title } from 'shared/ui/Title';
import { Button } from 'shared/ui/Button';

import styles from './StorageHistory.module.scss';
import HistoryServices from 'shared/services/HistoryServices';
import dayjs from 'dayjs';

export const StorageHistory = () => {
  const theme = useMantineTheme();

  const [history, setHistory] = useState<IHistory[]>([]);
  const [isLoading, setLoading] = useState(true);

  const getHistory = () => {
    HistoryServices.getHistory()
      .then((response) => setHistory(response.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getHistory();
  }, []);

  if (isLoading) {
    return (
      <Flex align={'center'} justify={'center'}>
        <Loader color={theme.colors.myBlue[2]} />
      </Flex>
    );
  }

  return (
    <Stack gap={24}>
      {history.length ? (
        <>
          {' '}
          <Flex gap={5}>
            <Title level={3} title="История" />
            <Title level={3} title={`(${history.length})`} color="gray" />
          </Flex>
          <Grid gutter={8}>
            {history.map((h, index) => (
              <Grid.Col key={h.id} span={12}>
                <Flex
                  className={classNames(styles.history, {
                    [styles.first]: index === 0,
                  })}
                  align={'center'}
                  justify={'space-between'}
                >
                  <Stack gap={18} flex={1}>
                    <Title
                      level={4}
                      title={`Анализ от ${dayjs(
                        h.dateCreated.replace('"', '').replace(`"`, '')
                      ).format('DD.MM.YYYY')}`}
                    />
                    <p className="text medium">
                      {dayjs(
                        h.dateCreated.replace('"', '').replace(`"`, '')
                      ).format('hh:mm:ss')}
                    </p>
                    <p className="text placeholder">
                      Условия события: загрузка файлов
                    </p>
                  </Stack>
                  <Flex flex={1} align={'center'} justify={'space-between'}>
                    <Stack gap={8}>
                      <Flex gap={3}>
                        <p className="text placeholder">
                          Количество потребителей:
                        </p>
                        <p className="text medium">{h.objectCount}</p>
                      </Flex>
                    </Stack>
                    <NavLink
                      state={{
                        returnPage: { title: 'Хранилище', href: STORAGE_ROUTE },
                      }}
                      to={`${PREDICTION_ROUTE}?id=${h.id}&isSaved=true`}
                    >
                      <Button
                        w={57}
                        type="outline"
                        icon={<IconArrowRight size={18} />}
                      />
                    </NavLink>
                  </Flex>
                </Flex>
              </Grid.Col>
            ))}
          </Grid>
        </>
      ) : null}
    </Stack>
  );
};
