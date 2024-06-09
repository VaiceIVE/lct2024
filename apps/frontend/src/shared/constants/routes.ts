import {
  CREATE_PREDICTION_ROUTE,
  HOME_ROUTE,
  LOGIN_ROUTE,
  RESPONSE_ROUTE,
  STORAGE_ROUTE,
} from 'shared/constants/const';
import { lazy } from 'react';
import {
  IconChartArcs,
  IconDatabase,
  IconTransitionRight,
} from '@tabler/icons-react';

//User
const prediction = lazy(() => import('pages/prediction'));
const response = lazy(() => import('pages/response'));
const storage = lazy(() => import('pages/storage'));

const createPrediction = lazy(() => import('pages/create-prediction'));

export const publicRoutes = [
  {
    path: LOGIN_ROUTE,
    Component: prediction,
    title: 'login',
  },
];

export const authRoutes = [
  {
    path: HOME_ROUTE,
    Component: prediction,
    navbarTitle: 'Прогнозы',
    pageTitle: 'Базовый прогноз',
    icon: IconChartArcs,
  },
  {
    path: RESPONSE_ROUTE,
    Component: response,
    navbarTitle: 'Реагирование',
    pageTitle: '1',
    icon: IconTransitionRight,
  },
  {
    path: STORAGE_ROUTE,
    Component: storage,
    navbarTitle: 'Хранилище',
    pageTitle: '2',
    icon: IconDatabase,
  },
  {
    path: CREATE_PREDICTION_ROUTE,
    Component: createPrediction,
    navbarTitle: null,
    pageTitle: 'Новый прогноз',
    icon: null,
  },
];
