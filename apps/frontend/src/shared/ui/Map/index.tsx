import classNames from 'classnames';
import {
  Map as MapComponent,
  Placemark,
  ZoomControl,
  Circle,
} from '@pbe/react-yandex-maps';
import * as turf from '@turf/turf';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { IBuilding } from 'shared/models/IBuilding';
import { IObj } from 'shared/models/IResponse';
import { location as LOCATION } from './helpers';
import { CTP_LIST } from 'shared/constants/CTP_LIST';

import mkd from 'shared/assets/mkd.svg';
import social from 'shared/assets/social.svg';
import prom from 'shared/assets/prom.svg';
import tp from 'shared/assets/tp.svg';
import center from 'shared/assets/center.svg';

import styles from './Map.module.scss';
import { CTPS } from './components/Ctps';
import { Districts } from './components/Districs';
import { Buildings } from './components/Buildings';

interface MapProps {
  fullWidth?: boolean;
  buildings?: IBuilding[] | undefined;
  onPlacemarkClick?: (building: IBuilding | null, obg: IObj | null) => void;
  objs?: IObj[];
  simpleMap?: boolean;
  showConnected?: string;
  buildingsCount?: number;
  onCircleClick?: (address: string) => void;
  regionFilter?: string;
}

export interface orginalList {
  UF_GEO_COORDINATES: string;
  UF_REG_NOMER_AKTA: string;
  UF_OBSHHAJA_INFORMAC: string;
  UF_NAZNACHENIE_OBEKT: string;
  UF_NAIMENOVANIE_OBEK: string;
  UF_STATUS: string;
  UF_TYPE: string;
}

export interface District {
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

const coordsToString = (coords: number[]) => {
  return coords.join(', ');
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
  regionFilter,
}: MapProps) => {
  const [uniqCtps, setUniqCtps] = useState<orginalList[]>([]);

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
        if (!marker.coords) {
          if (marker.district && !districtMap[marker.district]) {
            districtMap[marker.district] = [];
          }
          marker.district && districtMap[marker.district].push(marker.coords);
        }
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

  // const coordinatesToRemove = new Set(a);

  // const filteredObjects = CTP_LIST.filter(
  //   (obj) => !coordinatesToRemove.has(obj.UF_GEO_COORDINATES)
  // );

  // console.log(filteredObjects);

  const getUniqCtps = useCallback(() => {
    setUniqCtps(
      CTP_LIST.filter((ctp) => {
        const coordsString = ctp.UF_GEO_COORDINATES;
        const stringCtps = ctps.map((ctp) => coordsToString(ctp.coords));

        return !stringCtps.includes(coordsString);
      })
    );
  }, [ctps]);

  useEffect(() => {
    getUniqCtps();
  }, [ctps, getUniqCtps]);

  return (
    <div className={classNames(styles.wrapper, { [styles.full]: fullWidth })}>
      <MapComponent
        width={'100%'}
        height={'100%'}
        defaultState={LOCATION}
        modules={[
          'templateLayoutFactory',
          'option.presetStorage',
          'option.Manager',
          'layout.ImageWithContent',
        ]}
      >
        {showConnected === 'Район' ? <Districts districts={districts} /> : null}
        {showConnected === 'ЦТП/ИТП' && regionFilter === 'Вся Москва' ? (
          <CTPS uniqCtps={uniqCtps} />
        ) : null}
        {showConnected === 'Дома' && markers && (
          <Buildings onPlacemarkClick={onPlacemarkClick} markers={markers} />
        )}
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
