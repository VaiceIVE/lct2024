export interface IBuilding {
  coords: [number, number];
  events: IEvents[];
  socialType: string;
  address: string;
  coolingRate: number;
  consumersCount: number | null;
  priority: number;
  district: string | null;
}

// скорость остывания
//   характеристики
//   address
//   адрес отопительного обхекта

export interface IEvents {
  eventName: string;
  chance: number;
  date: string;
}
