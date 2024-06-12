import { useDisclosure } from '@mantine/hooks';
import qs from 'query-string';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import {
  IconArrowLeft,
  IconChevronsLeft,
  IconChevronsRight,
} from '@tabler/icons-react';
import { Flex, useMantineTheme } from '@mantine/core';
import classNames from 'classnames';

import { Drawer } from 'shared/ui/Drawer';
import PredictionServices from 'shared/services/PredictionServices';
import { IPrediction } from 'shared/models/IPrediction';
import { MapFilters } from 'widgets/map-filters';

import styles from './MapPage.module.scss';
import { Map } from 'shared/ui/Map';

const MapPage = () => {
  const [opened, { open, close }] = useDisclosure(true);
  const theme = useMantineTheme();

  const [prediction, setPrediction] = useState<IPrediction | null>(null);
  const [typeFilters, setTypeFilters] = useState<string[]>([]);

  const navigate = useNavigate();
  const location = useLocation();
  const { id, month } = qs.parse(location.search);

  const isDefault = !id;

  const getPredictionResult = useCallback(
    (month: string) => {
      console.log(id, isDefault);
      if (isDefault) {
        PredictionServices.getDefaultPrediction(+month).then((response) =>
          setPrediction(response.data)
        );
      } else {
        PredictionServices.getPredictionById(+id, +month).then((response) =>
          setPrediction(response.data)
        );
      }
    },
    [id, isDefault]
  );

  useEffect(() => {
    if (month) {
      getPredictionResult(`${month}`);
    }
  }, [getPredictionResult, month]);

  return (
    <div className={styles.wrapper}>
      <Drawer
        position="left"
        title={'Результаты на карте'}
        returnIcon={
          <IconArrowLeft
            cursor={'pointer'}
            color={theme.colors.myBlack[4]}
            size={24}
            onClick={() => navigate(-1)}
          />
        }
        close={close}
        opened={opened}
        backgroundOpacity={0}
        isFooterBorder={false}
        closeOnClickOutside={false}
        overlayZIndex={1}
      ></Drawer>
      <Flex
        align={'flex-start'}
        className={classNames(styles.drawer, {
          [styles.hide]: !opened,
          [styles.show]: opened,
        })}
        p={16}
      >
        <IconChevronsRight
          onClick={opened ? close : open}
          cursor={'pointer'}
          size={24}
        />
      </Flex>
      <Flex h={'100%'}>
        <Map fullWidth />
      </Flex>
      <MapFilters setTypeFilters={setTypeFilters} typeFilters={typeFilters} />
    </div>
  );
};

export default MapPage;
