import { ICtp } from './IBuilding';

export interface IResponse {
  obj: IObj[];
  date: string;
}

export interface IObj {
  id: number;
  address: string;
  socialType: string;
  isLast: boolean;
  consumersCount: number | null;
  date: string;
  event: string;
  coords: [number, number];
  priority: number;
  fullCooldown: number | null;
  normCooldown: number | null;
  district: string | null;
  characteristics: { [key: string]: string | number };
  connectionInfo: ICtp | null;
  index?: number;
}
