import { Children } from 'react';

import { Stack } from '@mantine/core';
import { PageHeader } from '../components/PageHeader';
import { Footer } from '../components/Footer';

type Props = {
  children?: React.ReactNode[];
  CustomTitle?: () => JSX.Element;
  title?: string;
  isLoading?: boolean;
  isHideTitle?: boolean;
  button?: React.ReactNode;
};

export const PageWrapper = ({ children, button, isLoading, title }: Props) => {
  return (
    <Stack flex={1} gap={0}>
      <PageHeader title={title} button={button} />
      <Stack flex={1} p={'24px 64px 96px'}>
        <Stack flex={1} gap={44}>
          {Children.map(children, (child) => child)}
        </Stack>
        {!isLoading ? <Footer /> : null}
      </Stack>
    </Stack>
  );
};
