import { AxiosResponse } from 'axios';
import $api from 'shared/api';
import { IFile } from '../models/IFiles';

export default class FileServices {
  static async deleteFile(id: number): Promise<AxiosResponse<IFile[]>> {
    return $api.delete<IFile[]>(`/file/${id}`);
  }

  static async uploadFile(file: File): Promise<AxiosResponse<IFile[]>> {
    const formData = new FormData();

    formData.append('file', file);

    return $api.post<IFile[]>('/file', { file: formData });
  }

  static async getUploadedFiles(): Promise<AxiosResponse<IFile[]>> {
    return $api.get<IFile[]>('/files');
  }
}
