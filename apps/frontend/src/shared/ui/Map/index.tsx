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
import { useCallback, useEffect, useMemo, useState } from 'react';
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

interface orginalList {
  UF_GEO_COORDINATES: string;
  UF_REG_NOMER_AKTA: string;
  UF_OBSHHAJA_INFORMAC: string;
  UF_NAZNACHENIE_OBEKT: string;
  UF_NAIMENOVANIE_OBEK: string;
  UF_STATUS: string;
  UF_TYPE: string;
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
    '55.7463336, 37.6140593',
    '55.7463424, 37.6140469',
    '55.7463547, 37.6140361',
    '55.7439455, 37.5925515',
    '55.7439534, 37.5925484',
    '55.7378587, 37.5726377',
    '55.7327563, 37.5799399',
    '55.7280545, 37.5717355',
    '55.7573659, 37.6035456',
    '55.7645636, 37.5860384',
    '55.7691331, 37.5725647',
    '55.7703643, 37.5646427',
    '55.7770618, 37.5390348',
    '55.7952532, 37.5250509',
    '55.8426309, 37.5651528',
    '55.8460453, 37.5674415',
    '55.8460398, 37.5674515',
    '55.8489556, 37.5775342',
    '55.8489639, 37.5775439',
    '55.8489513, 37.5775627',
    '55.8489477, 37.5775562',
    '55.8608392, 37.5444325',
    '55.8776429, 37.5013402',
    '55.8685352, 37.4384475',
    '55.8685307, 37.4384661',
    '55.8685345, 37.4384658',
    '55.8685418, 37.4384687',
    '55.8621389, 37.3673448',
    '55.8621477, 37.3673356',
    '55.8617412, 37.3737409',
    '55.8445588, 37.3664601',
    '55.8425445, 37.3712574',
    '55.8165317, 37.3273479',
    '55.8165489, 37.3273519',
    '55.7869353, 37.6038687',
    '55.7869348, 37.6038569',
    '55.8020344, 37.5967662',
    '55.8020479, 37.5967602',
    '55.8020526, 37.5967687',
    '55.8020532, 37.5967475',
    '55.8020584, 37.5967306',
    '55.8020618, 37.5967309',
    '55.8038347, 37.5909652',
    '55.8038387, 37.5909364',
    '55.8038447, 37.5909344',
    '55.8038572, 37.5909315',
    '55.7215303, 37.6157586',
    '55.7215376, 37.6157641',
    '55.7215489, 37.6157421',
    '55.7229465, 37.6146483',
    '55.7229611, 37.6146427',
    '55.7282306, 37.6210308',
    '55.7085534, 37.6370668',
    '55.7100349, 37.6470317',
    '55.7100512, 37.6470318',
    '55.7012359, 37.6340467',
    '55.7012561, 37.6340335',
    '55.7012606, 37.6340578',
    '55.7026659, 37.6227647',
    '55.7026625, 37.6227338',
    '55.6858316, 37.6385383',
    '55.6858407, 37.6385442',
    '55.6858551, 37.6385408',
    '55.6877518, 37.6611534',
    '55.6877631, 37.6611459',
    '55.6749487, 37.6130338',
    '55.6774547, 37.6021468',
    '55.6774486, 37.6021504',
    '55.6776302, 37.5977613',
    '55.6797546, 37.5960602',
    '55.6599446, 37.6287465',
    '55.6509517, 37.6323527',
    '55.6509592, 37.6323547',
    '55.6509667, 37.6323329',
    '55.6483648, 37.6315499',
    '55.6481304, 37.6319595',
    '55.6071527, 37.6558421',
    '55.6057321, 37.7227616',
    '55.5982317, 37.7334456',
    '55.5982384, 37.7334623',
    '55.5982389, 37.7334665',
    '55.5982521, 37.7334665',
    '55.5982575, 37.7334596',
    '55.5982636, 37.7334336',
    '55.5982654, 37.7334344',
    '55.5615424, 37.5806474',
    '55.5572658, 37.5591469',
    '55.5572619, 37.5591542',
    '55.5545334, 37.5557437',
    '55.5545437, 37.5557473',
    '55.5243578, 37.5116603',
    '55.4739671, 37.5378426',
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
              groupByCoordinates: true,
            }}
          >
            {uniqCtps.map((item) => (
              <Circle
                key={item.UF_GEO_COORDINATES}
                onClick={() => console.log(item.UF_GEO_COORDINATES)}
                geometry={[
                  [
                    item.UF_GEO_COORDINATES.split(', ')[0],
                    item.UF_GEO_COORDINATES.split(', ')[1],
                  ],
                  200,
                ]}
                modules={['geoObject.addon.hint', 'geoObject.addon.balloon']}
                options={{
                  strokeColor: 'rgba(0, 255, 0, 0.2)',
                  fillColor: 'rgba(0, 255, 0, 0.2)',
                  strokeWidth: 2,
                }}
              />
            ))}
          </Clusterer>
        )}

        {showConnected === 'ЦТП/ИТП' && (
          <Clusterer
            options={{
              groupByCoordinates: true,
            }}
          >
            {uniqCtps.map((item) => (
              <Placemark
                key={item.UF_GEO_COORDINATES}
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
                  iconOffset: [2, 30],
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
