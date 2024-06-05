import { Flex, Stack } from '@mantine/core';
import { Context } from 'main';
import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { Route, Routes } from 'react-router-dom';
import { authRoutes } from 'shared/constants/routes';
import Navbar from 'widgets/navbar';

export const Routing = observer(() => {
  const { UStore } = useContext(Context);

  return (
    <Flex className="wrapper" style={{ height: '100vh' }}>
      <Flex>
        {UStore.isAuth && (
          <div style={{ width: 'fit-content' }} className="wrapper">
            <Navbar />
          </div>
        )}
        <Stack w={'100%'} align="center">
          <Routes>
            {authRoutes.map(({ path, Component }) => (
              <Route key={path} path={path} element={<Component />} />
            ))}
          </Routes>
        </Stack>
      </Flex>
    </Flex>
  );
});
