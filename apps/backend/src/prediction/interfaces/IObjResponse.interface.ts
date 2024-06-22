export interface IObjResponse {
    coords: [number, number];
    geoBoundary: [[number, number]];
    events: IEvents[];
    socialType: string;
    address: string;
    coolingRate: number;
    consumersCount: number | null;
    priority: number;
    district: string | null;
    networkType: 'ctp' | 'itp' | null;
    characteristics: {[key: string]: string | number};
  } 

interface IEvents{
    eventName: string;
    chance: number;
    date: string;
}

export interface IPrediction {
    id: number;
    buildings: IObjResponse[];
  }