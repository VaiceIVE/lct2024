export interface IObj {
    address: string;
    socialType: string;
    isLast: boolean;
    consumersCount: number | null;
    event: string;
    coords: number[];
    priority: number;
    fullCooldown?: number;
    normCooldown?: number;
}