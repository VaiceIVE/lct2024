export interface IBuilding {
  coords: [number, number];
  events: IEvents[];
  socialType: string;
  address: string;
  coolingRate: number;
  consumersCount: number | null;
  priority: number;
  district: string | null;
  networkType: 'ctp' | 'itp' | null;
  characteristics: { [key: string]: string | number };
  connectionInfo: ICtp | null;
}

export interface IEvents {
  eventName: string;
  chance: number;
  date: string;
}

export interface ICtp {
  address: string;
  name: string;
  coords: [number, number];
}
