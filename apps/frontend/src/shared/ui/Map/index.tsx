import classNames from 'classnames';
import { Map as MapComponent, GeoObject } from '@pbe/react-yandex-maps';

import { features, location as LOCATION } from './helpers';

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
}

export const Map = ({ fullWidth }: MapProps) => {
  return (
    <div className={classNames(styles.wrapper, { [styles.full]: fullWidth })}>
      <MapComponent width={'100%'} height={'100%'} defaultState={LOCATION}>
        <GeoObject
          geometry={geoJsonData}
          options={{
            fillColor: '#00FF00',
            strokeColor: '#0000FF',
            opacity: 0.5,
            strokeWidth: 2,
          }}
        />
      </MapComponent>
    </div>
  );
};
