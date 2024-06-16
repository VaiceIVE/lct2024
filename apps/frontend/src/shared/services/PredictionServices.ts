import { AxiosResponse } from 'axios';
import $api from 'shared/api';
import { IPrediction } from 'shared/models/IPrediction';
import { ITemperatureConditions } from 'shared/models/ITemperatureConditions';

export default class PredictionServices {
  static async createPrediction(
    files: File[],
    conditions: ITemperatureConditions[]
  ) {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append(`files`, file);
    });

    return $api.post('/prediction', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  static async getDefaultPrediction(): Promise<AxiosResponse<number>> {
    return $api.get<number>(`/prediction/default`);
  }

  static async getPredictionById(
    id: number,
    month: number
  ): Promise<AxiosResponse<IPrediction>> {
    return $api.get<IPrediction>(`/prediction/${id}/${month}`);
  }

  static async savePrediction(id: number) {
    return $api.get(`/prediction/${id}/save`);
  }
}
