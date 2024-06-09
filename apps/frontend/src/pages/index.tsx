import { Flex, Loader, Stack } from '@mantine/core';
import { Context } from 'main';
import { observer } from 'mobx-react-lite';
import { lazy, useContext, useEffect, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { HOME_ROUTE, LOGIN_ROUTE } from 'shared/constants/const';
import { authRoutes, publicRoutes } from 'shared/constants/routes';
import Navbar from 'widgets/navbar';

const LoginPage = lazy(() => import('pages/login'));
const PredictionPage = lazy(() => import('pages/prediction'));

const Routing = observer(() => {
  const { UStore } = useContext(Context);
  const [isLoading, setLoading] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (
      UStore.isAuth &&
      !authRoutes.find((item) => item.path.includes(location.pathname))
    ) {
      navigate(HOME_ROUTE);
    }

    if (
      !UStore.isAuth &&
      !publicRoutes.find((item) => item.path.includes(location.pathname))
    ) {
      return navigate(LOGIN_ROUTE);
    }
  }, [UStore.isAuth, location.pathname, navigate]);

  useEffect(() => {
    setLoading(true);
    UStore.checkAuth().finally(() => {
      setLoading(false);
    });
  }, [UStore]);

  if (isLoading) {
    return (
      <Stack h={'100vh'} bg={'gray.0'} align="center" justify="center">
        <Loader size="xl" color="myBlue.2" />
      </Stack>
    );
  }

  return (
    <Flex className="wrapper" style={{ height: '100vh' }}>
      <Flex>
        {UStore.isAuth && (
          <div style={{ width: 'fit-content' }} className="wrapper">
            <Navbar />
          </div>
        )}
        <Stack w={'100%'}>
          <Routes>
            {UStore.isAuth &&
              authRoutes.map(({ path, Component }) => (
                <Route key={path} path={path} element={<Component />} />
              ))}
            {!UStore.isAuth &&
              publicRoutes.map(({ path, Component }) => (
                <Route key={path} path={path} element={<Component />} />
              ))}
            <Route
              path="*"
              element={UStore.isAuth ? <PredictionPage /> : <LoginPage />}
            />
          </Routes>
        </Stack>
      </Flex>
    </Flex>
  );
});

export default Routing;
