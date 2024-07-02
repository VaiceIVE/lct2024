import { ICtp } from "../../prediction/interfaces/IObjResponse.interface";

export interface IObj {
    id: number;
    address: string;
    socialType: string;
    isLast: boolean;
    consumersCount: number | null;
    connectionInfo: ICtp | null;
    event: string;
    geoBoundary: [[number, number]];
    coords: number[];
    priority: number;
    district: string;
    fullCooldown?: number;
    normCooldown?: number;
    characteristics: {[key: string]: string | number};
}