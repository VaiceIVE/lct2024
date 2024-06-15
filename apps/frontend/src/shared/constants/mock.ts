import { IBuilding } from 'shared/models/IBuilding';

export const data: IBuilding[] = [
  {
    address: 'Новокосинская улица, 32, Москва, 111672',
    events: [
      {
        eventName: 'Сильная течь в системе отопления',
        chance: 50,
        date: '12.06',
      },
      { eventName: 'P1 <= 0', chance: 90, date: '12.06' },
    ],
    socialType: 'mkd',
    coords: [55.717482785, 37.828189394],
    coolingRate: 3,
    consumersCount: null,
    priority: 1,
    district: 'Северное Измайлово',
  },
  {
    address: 'Новокосинская улица, 32, Москва, 111673',
    events: [
      {
        eventName: 'Сильная течь в системе отопления',
        chance: 50,
        date: '12.06',
      },
      { eventName: 'P1 <= 0', chance: 20, date: '12.06' },
    ],
    socialType: 'medicine',
    coords: [55.803579031, 37.513482336],
    coolingRate: 5,
    consumersCount: null,
    priority: 6,
    district: 'Восточное Измайлово',
  },
  {
    address: 'Новокосинская улица, 32, Москва, 123',
    events: [
      {
        eventName: 'Сильная течь в системе отопления',
        chance: 50,
        date: '12.06',
      },
      { eventName: 'P1 <= 0', chance: 20, date: '12.06' },
    ],
    socialType: 'medicine',
    coords: [55.720046086, 37.797663794],
    coolingRate: 5,
    consumersCount: null,
    priority: 3,
    district: 'Северное Измайлово',
  },
  {
    address: 'Новокосинская улица, 32, Москва, 1223',
    events: [
      {
        eventName: 'Сильная течь в системе отопления',
        chance: 50,
        date: '12.06',
      },
      { eventName: 'P1 <= 0', chance: 20, date: '12.06' },
    ],
    socialType: 'tp',
    coords: [55.766228272, 37.668013072],
    coolingRate: 5,
    consumersCount: null,
    priority: 4,
    district: 'Северное Измайлово',
  },
  {
    address: 'Новокоси2нская улица, 32, Москва, 1223',
    events: [
      {
        eventName: 'Сильная течь в системе отопления',
        chance: 50,
        date: '12.06',
      },
      { eventName: 'P1 <= 0', chance: 20, date: '12.06' },
    ],
    socialType: 'education',
    coords: [55.815345188, 37.514882646],
    coolingRate: 5,
    consumersCount: null,
    priority: 5,
    district: 'Восточное Измайлово',
  },
];
