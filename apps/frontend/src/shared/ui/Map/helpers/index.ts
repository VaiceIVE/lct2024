import ymaps from 'yandex-maps';

export const location: ymaps.IMapState = { center: [55.75, 37.63], zoom: 10 };

export const features: YMaps.YMapFeatureProps[] = [
  {
    id: '1',
    style: {
      fillRule: 'nonzero',
      fill: 'blue',
      fillOpacity: 0.6,
    },
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [25.029762, 55.189311],
          [25.229762, 55.289311],
          [25.329762, 55.389311],
        ],
      ],
    },
    properties: { hint: 'Polygon 1' },
  },
  {
    id: '2',
    style: {
      fillRule: 'nonzero',
      fill: 'red',
      fillOpacity: 0.6,
    },
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [37.9, 55.8],
          [37.9, 55.75],
          [38.0, 55.75],
          [38.0, 55.8],
        ],
      ],
    },
    properties: { hint: 'Polygon 2' },
  },
  {
    id: '3',
    style: {
      fillRule: 'nonzero',
      fill: 'red',
    },
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [38.0, 55.8],
          [38.0, 55.75],
          [38.1, 55.75],
          [38.1, 55.8],
        ],
      ],
    },
    properties: { hint: 'Polygon 3' },
  },
];
