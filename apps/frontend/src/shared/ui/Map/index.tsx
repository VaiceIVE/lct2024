import classNames from 'classnames';
import {
  Map as MapComponent,
  Placemark,
  ZoomControl,
  Polygon,
  Circle,
  Clusterer,
} from '@pbe/react-yandex-maps';
import * as turf from '@turf/turf';
import { useMemo } from 'react';
import { IBuilding } from 'shared/models/IBuilding';
import { IObj } from 'shared/models/IResponse';
import { location as LOCATION } from './helpers';

import mkd from 'shared/assets/mkd.svg';
import social from 'shared/assets/social.svg';
import prom from 'shared/assets/prom.svg';
import tp from 'shared/assets/tp.svg';
import center from 'shared/assets/center.svg';

import styles from './Map.module.scss';
import { CTP_LIST } from 'shared/constants/CTP_LIST';

interface MapProps {
  fullWidth?: boolean;
  buildings?: IBuilding[] | undefined;
  onPlacemarkClick?: (building: IBuilding | null, obg: IObj | null) => void;
  objs?: IObj[];
  simpleMap?: boolean;
  showConnected?: string;
  buildingsCount?: number;
  onCircleClick?: (address: string) => void;
}

interface District {
  name: string;
  coords: [number, number][];
}

interface CTP {
  name: string;
  address: string;
  coords: [number, number];
  priority: number;
  fillColor?: string;
  strokeColor?: string;
  index: number;
}

const getColorShade = (
  index: number,
  total: number
): { fillColor: string; strokeColor: string } => {
  const ratio = index / (total - 1);

  if (total === 1)
    return {
      fillColor: 'rgba(255, 0, 0, 0.5)',
      strokeColor: 'rgba(255, 0, 0, 0.5)',
    };

  const red = 255;
  const green = Math.round(255 * (1 - ratio));
  const blue = 0;

  const fillColor = `rgba(${red}, ${green}, ${blue}, 0.5)`;
  const strokeColor = `rgba(${red}, ${green}, ${blue}, 0.5)`;

  return { fillColor, strokeColor };
};

const getDistrictColor = (
  index: number,
  total: number
): { fillColor: string; strokeColor: string } => {
  const ratio = index / (total - 1);

  if (total === 1)
    return {
      fillColor: 'rgba(255, 0, 0, 0.5)',
      strokeColor: 'rgba(255, 0, 0, 0.5)',
    };

  const red = Math.round(255 * (1 - ratio));
  const green = Math.round(255 * (1 - ratio));
  const blue = 50;

  const fillColor = `rgba(${red}, ${green}, ${blue}, 0.5)`;
  const strokeColor = `rgba(${red}, ${green}, ${blue}, 0.5)`;

  return { fillColor, strokeColor };
};

export const Map = ({
  fullWidth,
  buildings,
  objs,
  onPlacemarkClick,
  simpleMap,
  showConnected,
  buildingsCount,
  onCircleClick,
}: MapProps) => {
  const iconsTypes: { [key: string]: string } = {
    mkd: mkd,
    medicine: social,
    education: social,
    tp: tp,
    prom: prom,
  };

  const markers = buildings?.length ? buildings : objs;

  const districts: District[] = useMemo(() => {
    const districtMap: { [key: string]: [number, number][] } = {};

    markers &&
      markers.forEach((marker) => {
        const { coords } = marker;
        if (marker.district && !districtMap[marker.district]) {
          districtMap[marker.district] = [];
        }
        marker.district && districtMap[marker.district].push(coords);
      });

    const createEnvelopeWithPadding = (
      coords: [number, number][]
    ): [number, number][] => {
      const points = turf.points(coords);
      const envelope = turf.envelope(points);
      if (!envelope) {
        return coords;
      }
      const buffered = turf.buffer(envelope, 0.001, { units: 'degrees' });
      if (
        buffered &&
        buffered.geometry &&
        buffered.geometry.type === 'Polygon'
      ) {
        return buffered.geometry.coordinates[0] as [number, number][];
      }
      return coords;
    };

    return Object.keys(districtMap).map((district) => ({
      name: district,
      coords: createEnvelopeWithPadding(districtMap[district]),
    }));
  }, [markers]);

  const ctps: CTP[] = useMemo(() => {
    const ctpMap: CTP[] = [];

    markers &&
      markers.forEach((marker) => {
        if (
          marker?.connectionInfo &&
          !ctpMap.map((c) => c.name).includes(marker?.connectionInfo.name)
        ) {
          ctpMap.push({
            address: marker?.connectionInfo?.address,
            coords: marker?.connectionInfo?.coords,
            name: marker?.connectionInfo?.name,
            priority: 0,
            index: marker?.index || marker.index === 0 ? marker.index : 1,
          });
        }
      });

    markers &&
      markers.forEach((marker) => {
        if (marker?.connectionInfo) {
          const ctp = ctpMap.find(
            (c) => c.name === marker.connectionInfo?.name
          );
          if (ctp && marker.priority) {
            ctp.priority += marker.priority;
          }
        }
      });

    return ctpMap
      .sort((a, b) => b.priority - a.priority)
      .map((c) => ({
        ...c,
        ...getColorShade(c.index, buildingsCount || 1),
      }));
  }, [buildingsCount, markers]);

  const a = [];

  // const coordinatesToRemove = new Set(a);

  // const filteredObjects = CTP_LIST.filter(
  //   (obj) => !coordinatesToRemove.has(obj.UF_GEO_COORDINATES)
  // );

  // console.log(filteredObjects);

  return (
    <div className={classNames(styles.wrapper, { [styles.full]: fullWidth })}>
      <MapComponent width={'100%'} height={'100%'} defaultState={LOCATION}>
        {showConnected === 'Район' &&
          districts &&
          districts.map(({ name, coords }, index) => {
            const { fillColor, strokeColor } = getDistrictColor(
              index,
              districts.length || 1
            );

            return (
              <Polygon
                key={name}
                geometry={[coords]}
                options={{
                  fillColor,
                  strokeColor,
                  strokeWidth: 2,
                }}
              />
            );
          })}
        {showConnected === 'ЦТП/ИТП' && (
          <Clusterer
            options={{
              groupByCoordinates: false,
            }}
          >
            {CTP_LIST.map((item) => (
              <Placemark
                onClick={() => console.log(item.UF_GEO_COORDINATES)}
                geometry={[
                  item.UF_GEO_COORDINATES.split(', ')[0],
                  item.UF_GEO_COORDINATES.split(', ')[1],
                ]}
                modules={['geoObject.addon.hint', 'geoObject.addon.balloon']}
                options={{
                  iconLayout: 'default#image',
                  iconContentLayout: center,
                  iconImageHref: center,
                  iconImageSize: [17, 17],
                  iconOffset: [4, 31],
                  iconContentSize: [30, 30],
                  zIndex: 100,
                }}
              />
            ))}
          </Clusterer>
        )}
        {showConnected === 'Дома' &&
          CTP_LIST.map((item) => (
            <Placemark
              onClick={() => console.log(item.UF_GEO_COORDINATES)}
              geometry={[
                item.UF_GEO_COORDINATES.split(', ')[0],
                item.UF_GEO_COORDINATES.split(', ')[1],
              ]}
              modules={['geoObject.addon.hint', 'geoObject.addon.balloon']}
              options={{
                iconLayout: 'default#image',
                iconContentLayout: center,
                iconImageHref: center,
                iconImageSize: [17, 17],
                iconOffset: [4, 31],
                iconContentSize: [30, 30],
                zIndex: 100,
              }}
            />
          ))}
        {showConnected === 'ЦТП/ИТП' &&
          ctps &&
          ctps.map(({ name, coords, address, fillColor, strokeColor }) => {
            return (
              <div key={name}>
                <Circle
                  onClick={
                    onCircleClick ? () => onCircleClick(address) : undefined
                  }
                  geometry={[coords, 700]}
                  options={{
                    fillColor,
                    strokeColor,
                    strokeWidth: 2,
                  }}
                />
                <Placemark
                  onClick={
                    onCircleClick ? () => onCircleClick(address) : undefined
                  }
                  geometry={coords}
                  options={{
                    iconLayout: 'default#image',
                    iconContentLayout: center,
                    iconImageHref: center,
                    iconImageSize: [17, 17],
                    iconOffset: [4, 31],
                    iconContentSize: [30, 30],
                    zIndex: 700,
                  }}
                />
              </div>
            );
          })}
        {simpleMap ? (
          <ZoomControl
            options={{ size: 'small', position: { top: '24px', left: '24px' } }}
          />
        ) : null}
        {showConnected !== 'Дома' &&
          markers &&
          markers.map((marker) => (
            <Placemark
              onClick={
                !simpleMap && onPlacemarkClick
                  ? 'events' in marker
                    ? () => onPlacemarkClick(marker, null)
                    : () => onPlacemarkClick(null, marker)
                  : undefined
              }
              key={marker.address}
              geometry={marker.coords}
              modules={['geoObject.addon.hint', 'geoObject.addon.balloon']}
              options={{
                iconLayout: 'default#image',
                iconContentLayout: iconsTypes[marker.socialType],
                iconImageHref: iconsTypes[marker.socialType],
                iconImageSize: [30, 30],
                iconOffset: [1, 21],
              }}
            />
          ))}
      </MapComponent>
    </div>
  );
};
