import {
  YMap,
  YMapDefaultSchemeLayer,
  YMapDefaultFeaturesLayer,
  YMapComponentsProvider,
  YMapCollection,
  YMapFeature,
  YMapListener,
  YMapDefaultMarker,
  YMapGeolocationControl,
  YMapHint,
  YMapZoomControl,
  YMapFeatureDataSource,
  YMapControls,
  YMapControlButton,
  YMapContainer,
  YMapHintContext,
} from 'ymap3-components';
import classNames from 'classnames';
import * as YMaps from '@yandex/ymaps3-types';

import { features, location as LOCATION } from './helpers';

import styles from './Map.module.scss';
import React, { useCallback, useContext, useEffect, useState } from 'react';

interface MapProps {
  fullWidth?: boolean;
}

export const Map = ({ fullWidth }: MapProps) => {
  const [location, setLocation] = useState(LOCATION);
  const [ymap, setYmap] = useState<YMaps.YMap>();

  return (
    <div className={classNames(styles.wrapper, { [styles.full]: fullWidth })}>
      <YMap
        key="map"
        // ref={(ymap: YMaps.YMap) => setYmap(ymap)}
        location={LOCATION}
        mode="vector"
      >
        <YMapDefaultSchemeLayer />
        <YMapDefaultFeaturesLayer />
        {/* <YMapListener onUpdate={onUpdate} /> */}

        <YMapDefaultMarker coordinates={LOCATION.center} />

        <YMapControls position="bottom">
          <YMapZoomControl />
        </YMapControls>
        <YMapCollection>
          {features.map((feature) => (
            <YMapFeature key={feature.id} {...feature} />
          ))}
        </YMapCollection>
      </YMap>
    </div>
  );
};
