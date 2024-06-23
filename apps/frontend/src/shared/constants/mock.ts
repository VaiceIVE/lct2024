import { IBuilding } from 'shared/models/IBuilding';
import { IResponse } from 'shared/models/IResponse';

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
    district: 'муниципальный округ Преображенское',
    networkType: null,
    characteristics: {
      'Год постройки': 1967,
      'Материал стен': 'Кирпич',
      Этажность: 8,
      'Кол-во квартир': 200,
      'Теплопроводность стен': 'Низкая',
      'Износ объекта по БТИ': 'Высокий',
      'Класс энергоэфективности': 'Высокий',
      'Признак аварийности здания': 'Признак',
    },
    connectionInfo: null,
    geoBoundaries: null,
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
    networkType: 'itp',
    characteristics: {
      'Год постройки': 1967,
      'Материал стен': 'Кирпич',
      Этажность: 8,
      'Кол-во квартир': 200,
      'Теплопроводность стен': 'Низкая',
      'Износ объекта по БТИ': 'Высокий',
      'Класс энергоэфективности': 'Высокий',
      'Признак аварийности здания': 'Признак',
    },
    connectionInfo: null,
    geoBoundaries: null,
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
    district: 'муниципальный округ Преображенское',
    networkType: null,
    characteristics: {
      'Год постройки': 1967,
      'Материал стен': 'Кирпич',
      Этажность: 8,
      'Кол-во квартир': 200,
      'Теплопроводность стен': 'Низкая',
      'Износ объекта по БТИ': 'Высокий',
      'Класс энергоэфективности': 'Высокий',
      'Признак аварийности здания': 'Признак',
    },
    connectionInfo: null,
    geoBoundaries: null,
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
    district: 'муниципальный округ Преображенское',
    networkType: 'ctp',
    characteristics: {
      'Год постройки': 1967,
      'Материал стен': 'Кирпич',
      Этажность: 8,
      'Кол-во квартир': 200,
      'Теплопроводность стен': 'Низкая',
      'Износ объекта по БТИ': 'Высокий',
      'Класс энергоэфективности': 'Высокий',
      'Признак аварийности здания': 'Признак',
    },
    connectionInfo: null,
    geoBoundaries: null,
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
    networkType: null,
    characteristics: {
      'Год постройки': 1967,
      'Материал стен': 'Кирпич',
      Этажность: 8,
      'Кол-во квартир': 200,
      'Теплопроводность стен': 'Низкая',
      'Износ объекта по БТИ': 'Высокий',
      'Класс энергоэфективности': 'Высокий',
      'Признак аварийности здания': 'Признак',
    },
    connectionInfo: null,
    geoBoundaries: null,
  },
];

export const responseData: IResponse = {
  date: '15.10.2024',
  obj: [
    {
      id: 1,
      date: '15.10.2024',
      address: '1Новокосинская улица, 32, Москва, 111672',
      socialType: 'mkd',
      consumersCount: null,
      coords: [55.717482785, 37.828189394],
      event: 'Прорыв трубы',
      priority: 1,
      isLast: false,
      fullCooldown: 3,
      normCooldown: 2,
      district: 'Восточное Измайлово',
      characteristics: {
        'Год постройки': 1967,
        'Материал стен': 'Кирпич',
        Этажность: 8,
        'Кол-во квартир': 200,
        'Теплопроводность стен': 'Низкая',
        'Износ объекта по БТИ': 'Высокий',
        'Класс энергоэфективности': 'Высокий',
        'Признак аварийности здания': 'Признак',
      },
      connectionInfo: null,
      geoBoundaries: [
        [37.806190767, 55.816829558],
        [37.806385426, 55.81683491],
        [37.806389818, 55.816784602],
        [37.806426514, 55.81678541],
        [37.806428694, 55.816758459],
        [37.806391998, 55.816757651],
        [37.806404371, 55.816606729],
        [37.806441067, 55.816607536],
        [37.806443264, 55.816582382],
        [37.806406568, 55.816581574],
        [37.8064182, 55.81643784],
        [37.806455697, 55.816439094],
        [37.806457892, 55.816413939],
        [37.806420395, 55.816412686],
        [37.806429147, 55.816308476],
        [37.806464246, 55.816309286],
        [37.806466443, 55.816284132],
        [37.80643134, 55.816283321],
        [37.806443738, 55.816135543],
        [37.806478842, 55.816136802],
        [37.806481053, 55.816113444],
        [37.806445949, 55.816112185],
        [37.806458322, 55.815961262],
        [37.80649662, 55.815962963],
        [37.806498809, 55.815937359],
        [37.806460515, 55.815936108],
        [37.806464192, 55.81589658],
        [37.80626954, 55.815891226],
        [37.806190767, 55.816829558],
      ],
      coolingRate: 0,
    },
    {
      id: 2,
      date: '15.10.2024',
      address: '2Новокосинская улица, 32, Москва, 111672',
      socialType: 'education',
      consumersCount: null,
      coords: [55.720046086, 37.797663794],
      event: 'Прорыв трубы',
      priority: 2,
      isLast: false,
      fullCooldown: 3,
      normCooldown: 2,
      district: 'муниципальный округ Преображенское',
      characteristics: {
        'Год постройки': 1967,
        'Материал стен': 'Кирпич',
        Этажность: 8,
        'Кол-во квартир': 200,
        'Теплопроводность стен': 'Низкая',
        'Износ объекта по БТИ': 'Высокий',
        'Класс энергоэфективности': 'Высокий',
        'Признак аварийности здания': 'Признак',
      },
      connectionInfo: null,
      geoBoundaries: null,
      coolingRate: 5,
    },
    {
      id: 3,
      date: '15.10.2024',
      address: 'Снайперская ул., д.11, стр.2',
      socialType: 'tp',
      consumersCount: 190,
      coords: [55.815345188, 37.514882646],
      event: 'Прорыв трубы',
      priority: 3,
      isLast: true,
      fullCooldown: 3,
      normCooldown: 2,
      district: 'муниципальный округ Преображенское',
      characteristics: {
        'Год постройки': 1967,
        'Материал стен': 'Кирпич',
        Этажность: 8,
        'Кол-во квартир': 200,
        'Теплопроводность стен': 'Низкая',
        'Износ объекта по БТИ': 'Высокий',
        'Класс энергоэфективности': 'Высокий',
        'Признак аварийности здания': 'Признак',
      },
      connectionInfo: null,
      geoBoundaries: [
        [37.668299521, 55.766243148],
        [37.668315336, 55.766216182],
        [37.668246771, 55.766202355],
        [37.668261022, 55.766182126],
        [37.668187668, 55.76616606],
        [37.668172624, 55.766187186],
        [37.668129571, 55.766178264],
        [37.668146162, 55.766146356],
        [37.668053683, 55.76612852],
        [37.668028316, 55.766157295],
        [37.667826607, 55.766116256],
        [37.667772749, 55.766188183],
        [37.667750422, 55.766182824],
        [37.667709247, 55.766240363],
        [37.667943647, 55.766288545],
        [37.667927035, 55.766315512],
        [37.668032275, 55.766336925],
        [37.668049686, 55.766310405],
        [37.668264952, 55.766354569],
        [37.668302916, 55.766291646],
        [37.668331407, 55.766248494],
        [37.668299521, 55.766243148],
      ],
      coolingRate: 0,
    },
  ],
};
