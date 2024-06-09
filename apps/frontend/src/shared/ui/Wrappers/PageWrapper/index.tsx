import { Children } from 'react';

import { Stack } from '@mantine/core';
import { PageHeader } from '../components/PageHeader';

type Props = {
  children?: React.ReactNode[];
  CustomTitle?: () => JSX.Element;
  title?: string;
  fullWidth?: boolean;
  isHideTitle?: boolean;
  button?: React.ReactNode;
};

export const PageWrapper = ({ children, button, fullWidth }: Props) => {
  return (
    <Stack flex={fullWidth ? 1 : undefined} gap={0}>
      <PageHeader button={button} />
      <Stack flex={fullWidth ? 1 : undefined} p={'24px 64px 96px'} gap={44}>
        {Children.map(children, (child) => child)}
      </Stack>
    </Stack>
  );
};
