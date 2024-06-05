import axios from 'axios';
import { makeAutoObservable } from 'mobx';
import { API_URL } from 'shared/api';
import { IUser } from 'shared/models/IUser';
import { AuthResponse } from 'shared/models/response/AuthResponse';
import AuthServices from 'shared/services/AuthServices';

export default class UserStore {
  user = {} as IUser;
  isAuth = false;
  isLoading = false;
  error = '';

  constructor() {
    makeAutoObservable(this);
  }

  setAuth(bool: boolean) {
    this.isAuth = bool;
  }

  setError(error: string) {
    this.error = error;
  }

  setUser(user: IUser) {
    this.user = user;
  }

  setLoading(bool: boolean) {
    this.isLoading = bool;
  }

  async login(nickname: string, password: string, role: string) {
    try {
      const response = await AuthServices.login(nickname, password, role);
      localStorage.setItem('token', response.data.accessToken);
      localStorage.setItem('rtoken', response.data.refreshToken);
      this.setAuth(true);
      this.setUser(response.data.user);
    } catch (e: any) {
      this.setError('Ошибка');
      console.log(e.response?.data?.message);
    }
  }

  async registration(
    username: string,
    nickname: string,
    password: string,
    grade: string,
    role: string
  ) {
    try {
      const response = await AuthServices.registration(
        username,
        nickname,
        password,
        grade,
        role
      );
      localStorage.setItem('token', response.data.accessToken);
      localStorage.setItem('rtoken', response.data.refreshToken);
      this.setAuth(true);
      this.setUser(response.data.user);
    } catch (e: any) {
      this.setError('Ошибка');
      console.log(e.response?.data?.message);
    }
  }

  async logout() {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('rtoken');
      this.setAuth(false);
      this.setUser({} as IUser);
    } catch (e: any) {
      console.log(e.response?.data?.message);
    }
  }

  async checkAuth() {
    this.setLoading(true);
    try {
      const response = await axios.get<AuthResponse>(
        `${API_URL}/auth/refresh`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('rtoken')}`,
          },
        }
      );
      localStorage.setItem('token', response.data.accessToken);
      localStorage.setItem('rtoken', response.data.refreshToken);
      this.setAuth(true);
      this.setUser(response.data.user);
    } catch (e: any) {
      console.log(e);
      if (e.name === 403) {
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('rtoken');
        this.setAuth(false);
        this.setUser({} as IUser);
      }
    } finally {
      this.setLoading(false);
    }
  }
}
