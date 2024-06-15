import classNames from 'classnames';
import {
  Map as MapComponent,
  GeoObject,
  Placemark,
  ZoomControl,
} from '@pbe/react-yandex-maps';

import { IBuilding } from 'shared/models/IBuilding';
import { IObj } from 'shared/models/IResponse';
import { location as LOCATION } from './helpers';

import mkd from 'shared/assets/mkd.svg';
import social from 'shared/assets/social.svg';
import tp from 'shared/assets/tec.svg';

import styles from './Map.module.scss';

const geoJsonData = {
  type: 'Polygon',
  coordinates: [
    [
      [55.717482785, 37.828189394],
      [55.766228272, 37.668013072],
      [55.815345188, 37.514882646],
      [55.803579031, 37.513482336],
      [55.720046086, 37.797663794],
    ],
  ],
};

interface MapProps {
  fullWidth?: boolean;
  buildings?: IBuilding[] | undefined;
  onPlacemarkClick?: (building: IBuilding) => void;
  objs?: IObj[];
  simpleMap?: boolean;
}

export const Map = ({
  fullWidth,
  buildings,
  objs,
  onPlacemarkClick,
  simpleMap,
}: MapProps) => {
  const iconsTypes: { [key: string]: string } = {
    mkd: mkd,
    medicine: social,
    education: social,
    tp: tp,
    prom: tp,
  };

  const markers = buildings?.length ? buildings : objs;

  return (
    <div className={classNames(styles.wrapper, { [styles.full]: fullWidth })}>
      <MapComponent width={'100%'} height={'100%'} defaultState={LOCATION}>
        {!simpleMap ? (
          <GeoObject
            geometry={geoJsonData}
            options={{
              fillColor: '#00FF00',
              strokeColor: '#0000FF',
              opacity: 0.5,
              strokeWidth: 2,
            }}
          />
        ) : null}
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
