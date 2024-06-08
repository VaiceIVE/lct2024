import {
  HOME_ROUTE,
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

export const publicRoutes = [
  {
    path: HOME_ROUTE,
    Component: prediction,
    title: 'login',
  },
];

export const authRoutes = [
  {
    path: HOME_ROUTE,
    Component: prediction,
    navbarTitle: 'Прогнозы',
    pageTitle: 'Ближайшие спрогнозированные события',
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
];
