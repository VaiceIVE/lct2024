import { AxiosResponse } from 'axios';
import $api from 'shared/api';
import { IResponse } from 'shared/models/IResponse';

export default class ResponseServices {
  static async addObject(
    socialType: string,
    event: string,
    address: string
  ): Promise<AxiosResponse<IResponse>> {
    return $api.post<IResponse>('/response', { socialType, event, address });
  }

  static async changeObj(
    socialType: string,
    event: string,
    address: string,
    id: number
  ): Promise<AxiosResponse<IResponse>> {
    return $api.patch<IResponse>(`/response/${id}`, {
      socialType,
      event,
      address,
    });
  }

  static async deleteObj(id: number): Promise<AxiosResponse<IResponse>> {
    return $api.delete<IResponse>(`/response/${id}`);
  }

  static async updateDefaultDate(
    date: string
  ): Promise<AxiosResponse<IResponse>> {
    return $api.post<IResponse>('/response/date', { date });
  }

  static async getResponse(): Promise<AxiosResponse<IResponse>> {
    return $api.get<IResponse>('/response');
  }

  static async getAddresses(
    socialType: string
  ): Promise<AxiosResponse<{ address: string }[]>> {
    return $api.post<{ address: string }[]>('/obj/type', { socialType });
  }
}
