import { Stack } from '@mantine/core';
import { Children } from 'react';
import { PageHeader } from '../components/PageHeader';

type Props = {
  children?: React.ReactNode[];
  CustomTitle?: () => JSX.Element;
  title?: string;
  fullWidth?: boolean;
  isHideTitle?: boolean;
};

export const PageWrapper = ({ children }: Props) => {
  return (
    <Stack gap={0}>
      <PageHeader />
      <Stack p={'24px 64px'} gap={44}>
        {Children.map(children, (child) => (
          <div>{child}</div>
        ))}
      </Stack>
    </Stack>
  );
};
