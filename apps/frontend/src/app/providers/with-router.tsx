import { Loader, Stack } from '@mantine/core';
import { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';

export const withRouter = (component: () => React.ReactNode) => () =>
  (
    <BrowserRouter>
      <Suspense
        fallback={
          <Stack h={'100vh'} bg={'gray.0'} align="center" justify="center">
            <Loader size="xl" color="myOrange.1" />
          </Stack>
        }
      >
        {component() && component()}
      </Suspense>
    </BrowserRouter>
  );
