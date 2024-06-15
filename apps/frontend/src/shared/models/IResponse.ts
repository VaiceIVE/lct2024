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
  coords: number[];
  priority: number;
  fullCooldown: number;
  normCooldown: number;
}
