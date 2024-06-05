import {
  COMMUNITY_ROUTE,
  CONNECT_NO_PAGE_ROUTE,
  EDUCATIONS_ROUTE,
  LOGIN_ROUTE,
  MAGE_ROUTE,
  MY_PATH_ROUTE,
  MY_SOCIALS_ROUTE,
  NO_PAGE_ROUTE,
  ONBOARDING_ROUTE,
  PATH_DB_ROUTE,
  PROFILE_ROUTE,
  PROF_DB_ROUTE,
  REGISTRATION_ROUTE,
  STAT_ROUTE,
  TRAINING_ROUTE,
} from 'shared/constants/const';
import { lazy } from 'react';
import {
  IconChartHistogram,
  IconChessRook,
  IconFileDescription,
  IconMessages,
  IconRoute,
  IconSchool,
} from '@tabler/icons-react';

//User
const auth = lazy(() => import('pages/auth'));
const myPath = lazy(() => import('pages/my-path'));
const community = lazy(() => import('pages/community'));
const educations = lazy(() => import('pages/educations'));
const training = lazy(() => import('pages/training'));
const profile = lazy(() => import('pages/profile'));
const mySocials = lazy(() => import('pages/my-socials'));
const mage = lazy(() => import('pages/mage'));
const noPage = lazy(() => import('pages/no-page'));
const connectNoPage = lazy(() => import('pages/connect-no-page'));
const onboarding = lazy(() => import('pages/onboarding'));

//Admin
const stat = lazy(() => import('pages/stat'));
const profDb = lazy(() => import('pages/prof-db'));
const pathfDb = lazy(() => import('pages/path-db'));

export const authRoutes = [
  //User
  {
    path: MY_PATH_ROUTE,
    Component: myPath,
    title: 'Мой путь',
    isAdmin: false,
    icon: IconRoute,
  },
  {
    path: COMMUNITY_ROUTE,
    Component: community,
    title: 'Сообщества',
    isAdmin: false,
    icon: IconMessages,
  },
  {
    path: TRAINING_ROUTE,
    Component: training,
    title: 'Тренажер',
    isAdmin: false,
    icon: IconChessRook,
  },
  {
    path: EDUCATIONS_ROUTE,
    Component: educations,
    title: 'Уч. заведения',
    isAdmin: false,
    icon: IconSchool,
  },
  {
    path: PROFILE_ROUTE,
    Component: profile,
    title: 'Профиль',
    isAdmin: false,
    isHide: true,
  },
  {
    path: MY_SOCIALS_ROUTE,
    Component: mySocials,
    title: 'Мои соц. сети',
    isAdmin: false,
    isHide: true,
  },
  {
    path: MAGE_ROUTE,
    Component: mage,
    title: 'Маг',
    isAdmin: false,
    isHide: true,
  },
  {
    path: NO_PAGE_ROUTE,
    Component: noPage,
    title: 'Пустая страница',
    isAdmin: false,
    isHide: true,
  },
  {
    path: CONNECT_NO_PAGE_ROUTE,
    Component: connectNoPage,
    title: 'Пустая страница',
    isAdmin: false,
    isHide: true,
  },
  {
    path: ONBOARDING_ROUTE,
    Component: onboarding,
    title: 'Онбординг',
    isAdmin: false,
    isHide: true,
  },
  //Admin
  {
    path: STAT_ROUTE,
    Component: stat,
    title: 'Статистика',
    isAdmin: true,
    icon: IconChartHistogram,
  },
  {
    path: PROF_DB_ROUTE,
    Component: profDb,
    title: 'База профессий',
    isAdmin: true,
    icon: IconFileDescription,
  },
  {
    path: PATH_DB_ROUTE,
    Component: pathfDb,
    title: 'База путей',
    isAdmin: true,
    icon: IconRoute,
  },
];

export const publicRoutes = [
  {
    path: LOGIN_ROUTE,
    Component: auth,
    title: 'login',
  },
  {
    path: REGISTRATION_ROUTE,
    Component: auth,
    title: 'registration',
  },
  {
    path: NO_PAGE_ROUTE,
    Component: noPage,
    title: 'Пустая страница',
  },
];
