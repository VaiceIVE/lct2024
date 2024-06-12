export interface IHistory {
  id: number;
  date: string;
  time: string;
  anomalies?: string[];
  result: { [key: string]: string };
}
