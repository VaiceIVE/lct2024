import { useDisclosure } from '@mantine/hooks';
import qs from 'query-string';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { IconArrowLeft, IconChevronsRight } from '@tabler/icons-react';
import { Flex, useMantineTheme } from '@mantine/core';
import classNames from 'classnames';
import { FormProvider, useForm } from 'react-hook-form';

import { Drawer } from 'shared/ui/Drawer';
import PredictionServices from 'shared/services/PredictionServices';
import { IPrediction } from 'shared/models/IPrediction';
import { MapFilters } from 'widgets/map-filters';
import { Map } from 'shared/ui/Map';
import { ObjectInfo } from 'widgets/object-info';
import { MapList } from 'widgets/map-list';
import { socialTypes } from 'shared/constants/socialTypes';
import { IBuilding } from 'shared/models/IBuilding';

import styles from './MapPage.module.scss';

const data: IBuilding[] = [
  {
    address: 'Новокосинская улица, 32, Москва, 111672',
    events: [
      {
        eventName: 'Сильная течь в системе отопления',
        chance: 50,
        date: '12.06',
      },
      { eventName: 'P1 <= 0', chance: 90, date: '12.06' },
    ],
    socialType: 'МКД',
    coords: [55.717482785, 37.828189394],
    coolingRate: 3,
    consumersCount: null,
  },
  {
    address: 'Новокосинская улица, 32, Москва, 111673',
    events: [
      {
        eventName: 'Сильная течь в системе отопления',
        chance: 50,
        date: '12.06',
      },
      { eventName: 'P1 <= 0', chance: 20, date: '12.06' },
    ],
    socialType: 'Здравоохранение',
    coords: [55.803579031, 37.513482336],
    coolingRate: 5,
    consumersCount: null,
  },
];

const MapPage = () => {
  const [opened, { open, close }] = useDisclosure(true);
  const theme = useMantineTheme();

  const [prediction, setPrediction] = useState<IPrediction | null>(null);
  const [typeFilters, setTypeFilters] = useState<string[]>([
    'МКД',
    'Социальные объекты',
    '2',
  ]);
  const [selectedBuilding, setSelectedBuilding] = useState<IBuilding | null>(
    null
  );

  const filtersFields = useForm();

  const navigate = useNavigate();
  const location = useLocation();
  const { id, month } = qs.parse(location.search);

  const isDefault = !id;

  const getPredictionResult = useCallback(
    (month: string) => {
      if (isDefault) {
        PredictionServices.getDefaultPrediction(+month).then((response) =>
          setPrediction(response.data)
        );
      } else {
        PredictionServices.getPredictionById(+id, +month).then((response) =>
          setPrediction(response.data)
        );
      }

      setPrediction({ id: 3, buildings: data });
    },
    [id, isDefault]
  );

  const getFilteredBuildings = () => {
    return prediction?.buildings?.filter((b) => {
      if (typeFilters.includes(b.socialType)) {
        return true;
      }
      if (
        typeFilters.includes('Социальные объекты') &&
        socialTypes.includes(b.socialType)
      ) {
        return true;
      }
      return false;
    });
  };

  const onPlacemarkClick = (building: IBuilding) => {
    setSelectedBuilding(building);
    open();
  };

  useEffect(() => {
    if (month) {
      getPredictionResult(`${month}`);
    }
  }, [getPredictionResult, month]);

  return (
    <div className={styles.wrapper}>
      <FormProvider {...filtersFields}>
        <Drawer
          position="left"
          onCloseIconClick={() => navigate(-1)}
          title={selectedBuilding ? 'Карточка объекта' : 'Результаты на карте'}
          returnIcon={
            selectedBuilding ? (
              <IconArrowLeft
                cursor={'pointer'}
                color={theme.colors.myBlack[4]}
                size={24}
                onClick={() => setSelectedBuilding(null)}
              />
            ) : null
          }
          close={close}
          opened={opened}
          backgroundOpacity={0}
          isFooterBorder={false}
          closeOnClickOutside={false}
          overlayZIndex={1}
        >
          {selectedBuilding ? (
            <ObjectInfo selectedBuilding={selectedBuilding} />
          ) : (
            <MapList
              setSelectedBuilding={setSelectedBuilding}
              buildings={getFilteredBuildings()}
            />
          )}
        </Drawer>
        <Flex
          align={'flex-start'}
          onClick={opened ? close : open}
          className={classNames(styles.drawer, {
            [styles.hide]: !opened,
            [styles.show]: opened,
          })}
          p={16}
        >
          <IconChevronsRight size={24} />
        </Flex>
        <Flex h={'100%'}>
          <Map
            fullWidth
            buildings={getFilteredBuildings()}
            onPlacemarkClick={onPlacemarkClick}
          />
        </Flex>
        <MapFilters setTypeFilters={setTypeFilters} typeFilters={typeFilters} />
      </FormProvider>
    </div>
  );
};

export default MapPage;
