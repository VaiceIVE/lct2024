import { AxiosResponse } from 'axios';
import $api from 'shared/api';

export default class FileServices {
  static async deleteFile(name: string): Promise<AxiosResponse<string[]>> {
    return $api.delete<string[]>(`/storage/${name}`);
  }

  static async uploadFile(file: File): Promise<AxiosResponse<string[]>> {
    const formData = new FormData();

    formData.append('file', file);

    return $api.post<string[]>('/storage/table', formData);
  }

  static async getUploadedFiles(): Promise<AxiosResponse<string[]>> {
    return $api.get<string[]>('/storage/names');
  }

  static async downloadTable(id: string | null, month: number) {
    return $api.get(id ? `/table/${id}` : `/table`);
  }
}
