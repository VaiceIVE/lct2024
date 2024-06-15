import classNames from 'classnames';
import {
  Map as MapComponent,
  Placemark,
  ZoomControl,
  Polygon,
} from '@pbe/react-yandex-maps';
import * as turf from '@turf/turf';
import { useMemo } from 'react';
import { IBuilding } from 'shared/models/IBuilding';
import { IObj } from 'shared/models/IResponse';
import { location as LOCATION } from './helpers';
import mkd from 'shared/assets/mkd.svg';
import social from 'shared/assets/social.svg';
import tp from 'shared/assets/tec.svg';
import styles from './Map.module.scss';

interface MapProps {
  fullWidth?: boolean;
  buildings?: IBuilding[] | undefined;
  onPlacemarkClick?: (building: IBuilding) => void;
  objs?: IObj[];
  simpleMap?: boolean;
  showConnected?: string;
}

interface District {
  name: string;
  coords: [number, number][];
}

export const Map = ({
  fullWidth,
  buildings,
  objs,
  onPlacemarkClick,
  simpleMap,
  showConnected,
}: MapProps) => {
  const iconsTypes: { [key: string]: string } = {
    mkd: mkd,
    medicine: social,
    education: social,
    tp: tp,
    prom: tp,
  };

  const districts: District[] = useMemo(() => {
    const districtMap: { [key: string]: [number, number][] } = {};

    buildings &&
      buildings.forEach((building) => {
        const { coords } = building;
        if (building.district && !districtMap[building.district]) {
          districtMap[building.district] = [];
        }
        building.district && districtMap[building.district].push(coords);
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
  }, [buildings]);

  const markers = buildings?.length ? buildings : objs;

  return (
    <div className={classNames(styles.wrapper, { [styles.full]: fullWidth })}>
      <MapComponent width={'100%'} height={'100%'} defaultState={LOCATION}>
        {showConnected === 'Район' &&
          districts &&
          districts.map(({ name, coords }) => (
            <Polygon
              key={name}
              geometry={[coords]}
              options={{
                fillColor: 'rgba(255, 0, 0, 0.5)',
                strokeColor: 'rgba(255, 0, 0, 0.5)',
                strokeWidth: 2,
              }}
            />
          ))}
        {simpleMap ? (
          <ZoomControl
            options={{ size: 'small', position: { top: '24px', left: '24px' } }}
          />
        ) : null}
        {markers &&
          markers.map((marker) => (
            <Placemark
              onClick={
                !simpleMap && onPlacemarkClick && 'events' in marker
                  ? () => onPlacemarkClick(marker)
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
