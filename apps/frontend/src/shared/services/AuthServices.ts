import { AxiosResponse } from 'axios';
import $api from 'shared/api';
import { AuthResponse } from '../models/response/AuthResponse';

export default class AuthServices {
  static async login(
    nickname: string,
    password: string,
    role: string
  ): Promise<AxiosResponse<AuthResponse>> {
    return $api.post<AuthResponse>('/auth/signin', {
      nickname,
      password,
      role,
    });
  }

  static async registration(
    username: string,
    nickname: string,
    password: string,
    grade: string,
    role: string
  ): Promise<AxiosResponse<AuthResponse>> {
    return $api.post<AuthResponse>('/auth', {
      username,
      nickname,
      password,
      grade,
      role,
    });
  }
}
