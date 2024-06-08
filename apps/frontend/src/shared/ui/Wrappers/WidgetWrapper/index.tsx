import { Flex, Stack } from '@mantine/core';
import { Title } from 'shared/ui/Title';

type Props = {
  children?: React.ReactNode;
  title?: string;
  button?: React.ReactNode;
};

export const WidgetWrapper = ({ children, title, button }: Props) => {
  return (
    <Stack gap={24}>
      <Flex align={'center'} justify={'space-between'}>
        <Title title={title} level={3} />
        {button}
      </Flex>
      {children}
    </Stack>
  );
};
