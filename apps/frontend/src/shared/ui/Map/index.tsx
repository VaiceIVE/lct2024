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

  const a = [
    '55.7052321, 37.6328684',
    '55.7052441, 37.6328496',
    '55.7052521, 37.6328682',
    '55.7052697, 37.6328689',
    '55.7052661, 37.6328602',
    '55.6834699, 37.6947417',
    '55.6834624, 37.6947309',
    '55.6834525, 37.6947339',
    '55.6834531, 37.6947459',
    '55.6834467, 37.6947561',
    '55.6867304, 37.6995614',
    '55.6867592, 37.6995455',
    '55.6335376, 37.4152581',
    '55.6335388, 37.4152471',
    '55.6335461, 37.4152354',
    '55.7153618, 37.4739628',
    '55.7338575, 37.4094633',
    '55.7940337, 37.4923632',
    '55.8239386, 37.5861609',
    '55.8239445, 37.5861507',
    '55.8734391, 37.5991355',
    '55.8734519, 37.5991493',
    '55.8734599, 37.5991442',
    '55.8709338, 37.6382617',
    '55.8709421, 37.6382656',
    '55.8812626, 37.6371544',
    '55.8812662, 37.6371503',
    '55.8827352, 37.6357596',
    '55.8827389, 37.6357369',
    '55.8827526, 37.6357301',
    '55.8827575, 37.6357373',
    '55.9410453, 37.5546576',
    '55.8822477, 37.6840425',
    '55.8822624, 37.6840605',
    '55.9155638, 37.7221627',
    '55.8087683, 37.6443671',
    '55.8120323, 37.7380555',
    '55.8120386, 37.7380699',
    '55.8120396, 37.7380643',
    '55.8120444, 37.7380624',
    '55.8120546, 37.7380542',
    '55.5624375, 37.4724346',
    '55.5624506, 37.4724335',
    '55.5624555, 37.4724379',
    '55.5624564, 37.4724319',
    '55.5624592, 37.4724397',
    '55.5624549, 37.4724526',
    '55.5624674, 37.4724517',
    '55.5624602, 37.4724639',
    '55.5622353, 37.4699559',
    '55.5622337, 37.4699633',
    '55.5622424, 37.4699604',
    '55.5622469, 37.4699316',
    '55.5622511, 37.4699424',
    '55.5622561, 37.4699404',
    '55.5622517, 37.4699533',
    '55.5622537, 37.4699642',
    '55.5622496, 37.4699637',
    '55.5622558, 37.4699585',
    '55.5622561, 37.4699404',
    '55.5622624, 37.4699309',
    '55.5622644, 37.4699323',
    '55.5622665, 37.4699567',
    '55.5622652, 37.4699584',
    '55.5622641, 37.4699653',
    '55.5622692, 37.4699661',
    '55.5624438, 37.4698492',
    '55.5624484, 37.4698551',
    '55.5624477, 37.4698658',
    '55.5624531, 37.4698681',
    '55.5624509, 37.4698303',
    '55.5624502, 37.4698414',
    '55.5624543, 37.4698402',
    '55.5624652, 37.4698334',
    '55.5624683, 37.4698639',
    '55.5624698, 37.4698696',
    '55.6891558, 37.9268436',
    '55.6981672, 37.9148479',
    '55.7039624, 37.9254479',
    '55.6828436, 37.9441485',
    '55.7649637, 37.6296597',
    '55.8087683, 37.6443671',
    '55.8482474, 37.6302469',
    '55.8482449, 37.6299607',
    '55.8482591, 37.6299587',
    '55.8520358, 37.6251386',
    '55.8520498, 37.6251542',
    '55.8520528, 37.6251611',
    '55.8520574, 37.6251695',
    '55.8520592, 37.6251514',
    '55.8520634, 37.6251503',
    '55.8498686, 37.6132572',
    '55.8638579, 37.5390695',
  ];

  const coordinatesToRemove = new Set(a);

  const filteredObjects = CTP_LIST.filter(
    (obj) => !coordinatesToRemove.has(obj.UF_GEO_COORDINATES)
  );

  console.log(filteredObjects);

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
      <MapComponent width={'100%'} height={'100%'} defaultState={LOCATION}>
        {showConnected === 'Район' ? <Districts districts={districts} /> : null}
        {showConnected === 'ЦТП/ИТП' && regionFilter === 'Вся Москва' ? (
          <CTPS uniqCtps={uniqCtps} />
        ) : null}
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
