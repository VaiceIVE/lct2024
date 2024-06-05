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
const forecast = lazy(() => import('pages/forecast'));

export const publicRoutes = [
  {
    path: HOME_ROUTE,
    Component: forecast,
    title: 'login',
  },
];

export const authRoutes = [
  {
    path: HOME_ROUTE,
    Component: forecast,
    navbarTitle: 'Прогнозы',
    pageTitle: 'Ближайшие спрогнозированные события',
    icon: IconChartArcs,
  },
  {
    path: RESPONSE_ROUTE,
    Component: forecast,
    navbarTitle: 'Реагирование',
    pageTitle: 'Ближайшие спрогнозированные события',
    icon: IconTransitionRight,
  },
  {
    path: STORAGE_ROUTE,
    Component: forecast,
    navbarTitle: 'Хранилище',
    pageTitle: 'Ближайшие спрогнозированные события',
    icon: IconDatabase,
  },
];
