/* eslint-disable @typescript-eslint/no-explicit-any */
import { Placemark, Polygon, Clusterer } from '@pbe/react-yandex-maps';
import { IBuilding } from 'shared/models/IBuilding';
import { IObj } from 'shared/models/IResponse';

import mkd1 from 'shared/assets/priorityIcons/mkd1.svg';
import mkd2 from 'shared/assets/priorityIcons/mkd2.svg';
import mkd3 from 'shared/assets/priorityIcons/mkd3.svg';

import social1 from 'shared/assets/priorityIcons/social1.svg';
import social2 from 'shared/assets/priorityIcons/social2.svg';
import social3 from 'shared/assets/priorityIcons/social3.svg';

import prom1 from 'shared/assets/priorityIcons/prom1.svg';
import prom2 from 'shared/assets/priorityIcons/prom2.svg';
import prom3 from 'shared/assets/priorityIcons/prom3.svg';

import tp1 from 'shared/assets/priorityIcons/tp1.svg';
import tp2 from 'shared/assets/priorityIcons/tp2.svg';
import tp3 from 'shared/assets/priorityIcons/tp3.svg';

interface BuildingsProps {
  markers: IBuilding[] | IObj[];
  onPlacemarkClick?: (building: IBuilding | null, obg: IObj | null) => void;
}

type Range = {
  min: number;
  max: number;
  value: any;
};

const mkd = {
  1: mkd1,
  2: mkd2,
  3: mkd3,
};

const social = {
  1: social1,
  2: social2,
  3: social3,
};

const prom = {
  1: prom1,
  2: prom2,
  3: prom3,
};

const tp = {
  1: tp1,
  2: tp2,
  3: tp3,
};

export const Buildings = ({ markers, onPlacemarkClick }: BuildingsProps) => {
  const iconsTypes: { [key: string]: { [key: number]: string } } = {
    mkd,
    medicine: social,
    education: social,
    prom,
    tp,
  };

  const getValueForRange = (coolingRate: number, ranges: Range[]): any => {
    for (const range of ranges) {
      if (coolingRate >= range.min && coolingRate <= range.max) {
        return range.value;
      }
    }
    throw new Error('Cooling rate is out of range');
  };

  const getIconColor = (coolingRate: number): number => {
    const ranges: Range[] = [
      { min: 0, max: 1, value: 3 },
      { min: 1.01, max: 3, value: 2 },
      { min: 3.01, max: 5, value: 1 },
    ];
    return getValueForRange(coolingRate, ranges);
  };

  const getPolygonColor = (coolingRate: number): string => {
    const ranges: Range[] = [
      { min: 0, max: 1, value: 'rgba(235, 87, 87, 1)' },
      { min: 1.01, max: 3, value: 'rgba(235, 167, 87, 1)' },
      { min: 3.01, max: 5, value: 'rgba(225, 209, 66, 1)' },
    ];
    return getValueForRange(coolingRate, ranges);
  };
  return markers.map((marker) =>
    marker.geoBoundary ? (
      <Polygon
        onClick={
          onPlacemarkClick
            ? 'events' in marker
              ? () => onPlacemarkClick(marker, null)
              : () => onPlacemarkClick(null, marker)
            : undefined
        }
        key={marker.address}
        geometry={[marker.geoBoundary.map((g) => [g[1], g[0]])]}
        options={{
          fillColor: getPolygonColor(marker.coolingRate),
          strokeColor: getPolygonColor(marker.coolingRate),
          opacity: 0.5,
          strokeWidth: 2,
        }}
      />
    ) : (
      <Clusterer
        options={{
          groupByCoordinates: true,
        }}
        key={marker.address}
      >
        <Placemark
          onClick={
            onPlacemarkClick
              ? 'events' in marker
                ? () => onPlacemarkClick(marker, null)
                : () => onPlacemarkClick(null, marker)
              : undefined
          }
          geometry={marker.coords}
          modules={['geoObject.addon.hint', 'geoObject.addon.balloon']}
          properties={{
            src: iconsTypes[marker.socialType],
            color: getIconColor(1),
          }}
          options={{
            iconLayout: 'default#image',
            iconImageHref:
              iconsTypes[marker.socialType][getIconColor(marker.coolingRate)],
            iconColor: '#FFFFFF',
            iconImageSize: [30, 30],
            iconPieChartCoreFillStyle: 'red',
            iconOffset: [1, 21],
          }}
        />
      </Clusterer>
    )
  );
};
