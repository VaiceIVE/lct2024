import { useDisclosure } from '@mantine/hooks';
import qs from 'query-string';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { IconArrowLeft, IconChevronsRight } from '@tabler/icons-react';
import { Flex, Loader, useMantineTheme, Stack } from '@mantine/core';
import classNames from 'classnames';
import { FormProvider, useForm } from 'react-hook-form';

import { Drawer } from 'shared/ui/Drawer';
import PredictionServices from 'shared/services/PredictionServices';
import ResponseServices from 'shared/services/ResponseServices';
import { IPrediction } from 'shared/models/IPrediction';
import { MapFilters } from 'widgets/map-filters';
import { Map } from 'shared/ui/Map';
import { ObjectInfo } from 'widgets/object-info';
import { MapList } from 'widgets/map-list';
import { socialTypes } from 'shared/constants/socialTypes';
import { IBuilding } from 'shared/models/IBuilding';
import { IObj, IResponse } from 'shared/models/IResponse';

import styles from './MapPage.module.scss';
import { findSquareForHouse } from 'shared/helpers';
import { isNull } from 'lodash';

const MapPage = () => {
  const [opened, { open, close }] = useDisclosure(true);
  const theme = useMantineTheme();

  const [prediction, setPrediction] = useState<IPrediction | null>(null);
  const [response, setResponse] = useState<IResponse>();

  const [typeFilters, setTypeFilters] = useState<string[]>([
    'mkd',
    'Социальные объекты',
    'prom',
  ]);
  const [isPriority, setPriority] = useState<boolean>(true);
  const [selectedBuilding, setSelectedBuilding] = useState<IBuilding | null>(
    null
  );
  const [selectedObj, setSelectedObj] = useState<IObj | null>(null);
  const [isLoading, setLoading] = useState<boolean>(true);

  const [showConnected, setShowConnected] = useState('Район');

  const filtersFields = useForm();

  const navigate = useNavigate();
  const location = useLocation();

  const { id, month, isResponse } = qs.parse(location.search);

  const isDefault = !id;

  const getPredictionResult = useCallback(
    (month: string) => {
      setLoading(true);
      if (isDefault) {
        PredictionServices.getDefaultPrediction()
          .then((response) =>
            PredictionServices.getPredictionById(response.data, month).then(
              (r) => {
                setPrediction({
                  id: r.data.id,
                  buildings: r.data.buildings.map((b) => ({
                    ...b,
                    connectionInfo: isNull(b.coords)
                      ? null
                      : findSquareForHouse(b.coords),
                  })),
                });
              }
            )
          )
          .finally(() => setLoading(false));
      } else {
        PredictionServices.getPredictionById(+id, month)
          .then((response) =>
            setPrediction({
              id: response.data.id,
              buildings: response.data.buildings.map((b) => ({
                ...b,
                connectionInfo: isNull(b.coords)
                  ? null
                  : findSquareForHouse(b.coords),
              })),
            })
          )
          .finally(() => setLoading(false));
      }
    },
    [id, isDefault]
  );

  const getFilteredBuildings = () => {
    return prediction?.buildings
      ?.sort((a, b) =>
        isPriority ? b.priority - a.priority : a.priority - b.priority
      )
      .filter((b) => {
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
      })
      .filter((item) =>
        item.address
          .toLowerCase()
          .includes(filtersFields.watch('address')?.toLowerCase() || '')
      )
      .filter(
        (b) =>
          !filtersFields.watch('district') ||
          b.district === filtersFields.watch('district')
      )
      .filter(
        (b) =>
          !filtersFields.watch('networkType') ||
          b.networkType === filtersFields.watch('networkType')
      )
      .filter(
        (b) =>
          !filtersFields.watch('events') ||
          b.events
            .map((e) => e.eventName)
            .includes(filtersFields.watch('events'))
      );
  };

  const getFilteredObjs = () => {
    return response?.obj
      ?.sort((a, b) =>
        isPriority ? b.priority - a.priority : a.priority - b.priority
      )
      .filter((b) => {
        if (typeFilters.includes(b.socialType)) {
          return true;
        }
        if (
          typeFilters.includes('Социальные объекты') &&
          socialTypes.includes(b.socialType)
        ) {
          return true;
        }
        if (typeFilters.includes('prom') && b.socialType === 'tp') {
          return true;
        }
        return false;
      })
      .filter((item) =>
        item.address
          .toLowerCase()
          .includes(filtersFields.watch('address')?.toLowerCase() || '')
      )
      .filter(
        (b) =>
          !filtersFields.watch('district') ||
          b.district === filtersFields.watch('district')
      )
      .filter(
        (b) =>
          !filtersFields.watch('filterSocialType') ||
          b.socialType === filtersFields.watch('filterSocialType')
      );
  };

  const onPlacemarkClick = (building: IBuilding | null, obj: IObj | null) => {
    if (building) setSelectedBuilding(building);
    if (obj) setSelectedObj(obj);
    open();
  };

  useEffect(() => {
    if (month) {
      getPredictionResult(`${month}`);
    }
  }, [getPredictionResult, month]);

  useEffect(() => {
    if (isResponse) {
      setLoading(true);
      ResponseServices.getResponse()
        .then((response) => {
          setResponse({
            date: response.data.date,
            obj: response.data.obj.map((o) => ({
              ...o,
              connectionInfo: isNull(o.coords)
                ? null
                : findSquareForHouse(o.coords),
            })),
          });
        })
        .finally(() => setLoading(false));

      if (location?.state?.obj) {
        setSelectedObj(location.state.obj);
      }
    }
  }, [isResponse, location]);

  return (
    <div className={styles.wrapper}>
      <FormProvider {...filtersFields}>
        <Drawer
          position="left"
          onCloseIconClick={() => navigate(-1)}
          title={
            selectedBuilding || selectedObj
              ? 'Карточка объекта'
              : 'Результаты на карте'
          }
          returnIcon={
            selectedBuilding || selectedObj ? (
              <IconArrowLeft
                cursor={'pointer'}
                color={theme.colors.myBlack[4]}
                size={24}
                onClick={() => {
                  setSelectedObj(null);
                  setSelectedBuilding(null);
                }}
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
          {selectedBuilding || selectedObj ? (
            <ObjectInfo
              selectedObj={selectedObj}
              selectedBuilding={selectedBuilding}
            />
          ) : (
            <MapList
              buildingsCount={prediction?.buildings.length}
              objsCount={response?.obj.length}
              setSelectedBuilding={setSelectedBuilding}
              setSelectedObj={setSelectedObj}
              buildings={getFilteredBuildings()}
              objs={getFilteredObjs()}
              setPriority={setPriority}
              isPriority={isPriority}
              isResponse={Boolean(isResponse)}
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
          {isLoading ? (
            <Stack className={styles.loader}>
              <Loader size={'xl'} color={theme.colors.myBlue[2]} />
            </Stack>
          ) : null}
          <Map
            fullWidth
            buildingsCount={
              response?.obj
                ? response.obj.length
                : prediction?.buildings?.length
            }
            buildings={
              selectedBuilding ? [selectedBuilding] : getFilteredBuildings()
            }
            objs={selectedObj ? [selectedObj] : getFilteredObjs()}
            onPlacemarkClick={onPlacemarkClick}
            showConnected={showConnected}
          />
        </Flex>
        <MapFilters
          setShowConnected={setShowConnected}
          showConnected={showConnected}
          setTypeFilters={setTypeFilters}
          typeFilters={typeFilters}
        />
      </FormProvider>
    </div>
  );
};

export default MapPage;
