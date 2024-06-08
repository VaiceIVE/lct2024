import { Stack } from '@mantine/core';
import { Children } from 'react';
import { PageHeader } from '../components/PageHeader';

type Props = {
  children?: React.ReactNode[];
  CustomTitle?: () => JSX.Element;
  title?: string;
  fullWidth?: boolean;
  isHideTitle?: boolean;
  button?: React.ReactNode;
};

export const PageWrapper = ({ children, button }: Props) => {
  return (
    <Stack gap={0}>
      <PageHeader button={button} />
      <Stack p={'24px 64px 96px'} gap={44}>
        {Children.map(children, (child) => (
          <div>{child}</div>
        ))}
      </Stack>
    </Stack>
  );
};
