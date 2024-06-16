import axios from 'axios';
import { IUser } from 'shared/models/IUser';

export const API_URL = import.meta.env.VITE_API_URL;

axios.defaults.withCredentials = true;

const $api = axios.create({
  withCredentials: true,
  baseURL: API_URL,
});

$api.interceptors.response.use(
  (config) => {
    return config;
  },
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response.status === 401 &&
      error.config &&
      !error.config._isRetry
    ) {
      originalRequest._isRetry = true;
      try {
        await axios.get<IUser>(`${API_URL}/auth/refresh`, {
          withCredentials: true,
        });
        return $api.request(originalRequest);
      } catch (e) {
        console.log('Пользователь не авторизован', e);
      }
      throw error;
    }
  }
);

export default $api;
