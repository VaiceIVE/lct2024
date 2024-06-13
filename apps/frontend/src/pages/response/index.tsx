import { Flex } from '@mantine/core';
import { DateValue } from '@mantine/dates';
import { useDisclosure } from '@mantine/hooks';
import {
  IconChevronLeft,
  IconLayoutGridAdd,
  IconPlus,
} from '@tabler/icons-react';
import { useState } from 'react';
import { months } from 'shared/constants/months';

import { Button } from 'shared/ui/Button';
import { Drawer } from 'shared/ui/Drawer';
import { PageWrapper } from 'shared/ui/Wrappers/PageWrapper';
import { EventsMap } from 'widgets/events-map';
import { ResponseCards } from 'widgets/response-cards';
import { ResponseDrawer } from 'widgets/response-drawer';
import { ResponseList } from 'widgets/response-list';

const ResponsePage = () => {
  const [date, setDate] = useState<DateValue>();
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <PageWrapper
      button={
        <Button
          label="Симулировать событие"
          type="orange"
          icon={<IconPlus size={18} />}
          onClick={open}
        />
      }
    >
      <ResponseCards setDate={setDate} date={date} />
      <ResponseList />
      <EventsMap months={months} monthsIndex={1} id={'3'} />
      <Drawer
        isBlur
        title="Симулирование события"
        opened={opened}
        close={close}
        footer={
          <Flex gap={12}>
            <Button
              fullWidth
              label="Отменить"
              onClick={close}
              isIconLeft
              icon={<IconChevronLeft size={18} />}
              type="white"
            />
            <Button
              fullWidth
              label="Добавить"
              icon={<IconLayoutGridAdd size={18} />}
            />
          </Flex>
        }
      >
        <ResponseDrawer />
      </Drawer>
    </PageWrapper>
  );
};

export default ResponsePage;
