export interface IBuilding {
  coords: number[];
  events: IEvents[];
  socialType: string;
  address: string;
  coolingRate: number;
  consumersCount: number | null;
  priority: number;
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
