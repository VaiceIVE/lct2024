import { Placemark, Circle, Clusterer } from '@pbe/react-yandex-maps';

import center from 'shared/assets/center.svg';
import { orginalList } from '../..';

interface CTPSProps {
  uniqCtps: orginalList[];
}

export const CTPS = ({ uniqCtps }: CTPSProps) => {
  return (
    <>
      <Clusterer
        options={{
          groupByCoordinates: true,
        }}
      >
        {uniqCtps.map((item) => (
          <Circle
            key={item.UF_GEO_COORDINATES}
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

      <Clusterer
        options={{
          groupByCoordinates: true,
        }}
      >
        {uniqCtps.map((item) => (
          <Placemark
            key={item.UF_GEO_COORDINATES}
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
    </>
  );
};
