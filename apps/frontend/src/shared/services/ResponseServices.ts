import { AxiosResponse } from 'axios';
import $api from 'shared/api';

export default class ResponseServices {
  static async addObject(): Promise<AxiosResponse<number[]>> {
    return $api.post<number[]>('/response');
  }
}
