import { withProviders } from './providers';
import './index.scss';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import { lazy } from 'react';

const Routing = lazy(() => import('../pages'));

const App = () => {
  return (
    <div className="app">
      <Routing />
    </div>
  );
};

export default withProviders(App);
