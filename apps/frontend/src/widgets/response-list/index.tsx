import { Flex } from '@mantine/core';
import { Title } from 'shared/ui/Title';
import { WidgetWrapper } from 'shared/ui/Wrappers/WidgetWrapper';

export const ResponseList = () => {
  return (
    <WidgetWrapper>
      <Flex align={'center'} justify={'space-between'}>
        <Title level={3} title="События по приоритету " />
      </Flex>
    </WidgetWrapper>
  );
};
