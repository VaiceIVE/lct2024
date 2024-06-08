import { DateValue } from '@mantine/dates';

export interface ITemperatureConditions {
  date: DateValue | undefined;
  anomalies: string[];
  id: string;
}
