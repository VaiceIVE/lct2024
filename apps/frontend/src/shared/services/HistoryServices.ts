import { AxiosResponse } from 'axios';
import $api from 'shared/api';
import { IHistory } from 'shared/models/IHistory';

export default class HistoryServices {
  static async getHistory(): Promise<AxiosResponse<IHistory[]>> {
    return $api.get<IHistory[]>('/history');
  }
}
