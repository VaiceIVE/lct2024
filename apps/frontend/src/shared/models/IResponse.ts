export interface IResponse {
  obj: IObj[];
  date: string;
}

export interface IObj {
  address: string;
  socialType: string;
  isLast: boolean;
  consumersCount: number | null;
  date: string;
  event: string;
  coords: number[];
  priority: number;
}
