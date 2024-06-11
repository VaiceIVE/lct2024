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
    files.forEach((file, index) => {
      formData.append(`file${index}`, file);
    });

    return $api.post('/prediction1', { formData, conditions });
  }

  static async getDefaultPrediction(
    month: number
  ): Promise<AxiosResponse<IPrediction>> {
    return $api.get<IPrediction>(`/prediction`);
  }

  static async getPredictionById(
    id: number,
    month: number
  ): Promise<AxiosResponse<IPrediction>> {
    return $api.get<IPrediction>(`/prediction/${id}`);
  }

  static async savePrediction(id: number) {
    return $api.get(`/prediction/${id}/save`);
  }
}
