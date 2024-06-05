import { withProviders } from './providers';
import './index.scss';
import '@mantine/core/styles.css';
import { Routing } from '../pages';
import { Context } from 'main';
import { useContext, useEffect } from 'react';

const App = () => {
  const { UStore } = useContext(Context);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      UStore.checkAuth();
    }
  }, []);

  return (
    <div className="app">
      <Routing />
    </div>
  );
};

export default withProviders(App);
