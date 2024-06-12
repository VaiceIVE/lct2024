/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { makeAutoObservable } from 'mobx';
import { API_URL } from 'shared/api';
import { IUser } from 'shared/models/IUser';
import AuthServices from 'shared/services/AuthServices';

export default class UserStore {
  user = {} as IUser;
  isAuth = true;
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

  async login(username: string, password: string) {
    try {
      const response = await AuthServices.login(username, password);
      if (response) {
        this.setAuth(true);
        this.setUser(response.data);
      }
    } catch (e: any) {
      this.setError('Ошибка');
      console.error(e.response?.data?.message);
    }
  }

  async registration(username: string, password: string) {
    try {
      const response = await AuthServices.registration(username, password);
      this.setAuth(true);
      this.setUser(response.data);
    } catch (e: any) {
      this.setError('Ошибка');
      console.error(e.response?.data?.message);
    }
  }

  async logout() {
    try {
      this.setAuth(false);
      this.setUser({} as IUser);
    } catch (e: any) {
      console.log(e.response?.data?.message);
    }
  }

  async checkAuth() {
    this.setLoading(true);
    try {
      const response = await axios.get<IUser>(`${API_URL}/auth/refresh`, {
        withCredentials: true,
      });

      this.setAuth(true);
      this.setUser(response.data);
    } catch (e: any) {
      console.info(e);

      //this.setAuth(false);
      this.setUser({} as IUser);
    } finally {
      this.setLoading(false);
    }
  }
}
