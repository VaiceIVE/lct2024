import { AxiosResponse } from 'axios';
import $api from 'shared/api';
import { IUser } from '../models/IUser';

export default class AuthServices {
  static async login(
    username: string,
    password: string
  ): Promise<AxiosResponse<IUser>> {
    return $api.post<IUser>('/auth/signin', {
      username,
      password,
    });
  }

  static async registration(
    username: string,
    password: string
  ): Promise<AxiosResponse<IUser>> {
    return $api.post<IUser>('/auth', {
      username,
      password,
    });
  }
}
