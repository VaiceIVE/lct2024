import { Flex } from '@mantine/core';
import { DateValue } from '@mantine/dates';
import { useDisclosure } from '@mantine/hooks';
import {
  IconChevronLeft,
  IconLayoutGridAdd,
  IconPlus,
} from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { months } from 'shared/constants/months';
import { IResponse } from 'shared/models/IResponse';
import ResponseServices from 'shared/services/ResponseServices';

import { Button } from 'shared/ui/Button';
import { Drawer } from 'shared/ui/Drawer';
import { Notice } from 'shared/ui/Notice';
import { PageWrapper } from 'shared/ui/Wrappers/PageWrapper';
import { EventsMap } from 'widgets/events-map';
import { ResponseCards } from 'widgets/response-cards';
import { ResponseDrawer } from 'widgets/response-drawer';
import { ResponseList } from 'widgets/response-list';

const data: IResponse = {
  date: '15.10.2024',
  obj: [
    {
      date: '15.10.2024',
      address: 'Новокосинская улица, 32, Москва, 111672',
      socialType: 'МКД',
      consumersCount: null,
      coords: [55.717482785, 37.828189394],
      event: 'Прорыв трубы',
      priority: 1,
      isLast: true,
    },
    {
      date: '15.10.2024',
      address: 'Новокосинская улица, 32, Москва, 111672',
      socialType: 'МКД',
      consumersCount: null,
      coords: [55.717482785, 37.828189394],
      event: 'Прорыв трубы',
      priority: 1,
      isLast: true,
    },
    {
      date: '15.10.2024',
      address: 'Новокосинская улица, 32, Москва, 111672',
      socialType: 'МКД',
      consumersCount: null,
      coords: [55.717482785, 37.828189394],
      event: 'Прорыв трубы',
      priority: 1,
      isLast: true,
    },
  ],
};

const ResponsePage = () => {
  const [opened, { open, close }] = useDisclosure(false);

  const [date, setDate] = useState<DateValue>();
  const [response, setResponse] = useState<IResponse | null>(null);

  const [isNoticeShow, setNoticeShow] = useState(false);
  const [isPriority, setPriority] = useState(true);

  const getResponse = () => {
    setResponse(data);
  };

  const handleAddObject = () => {
    setNoticeShow(true);
    ResponseServices.addObject().then(() => {
      //close();
    });
  };

  useEffect(() => {
    getResponse();
  }, []);

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
      <ResponseList
        setPriority={setPriority}
        isPriority={isPriority}
        obj={response?.obj}
      />
      <EventsMap months={months} monthsIndex={1} id={'3'} />
      <Drawer
        isBlur
        title="Симулирование события"
        opened={opened}
        close={close}
        footer={
          <Flex style={{ position: 'relative' }} gap={12}>
            {isNoticeShow ? (
              <Notice
                type="error"
                message={'Все поля должны быть заполнены'}
                close={() => setNoticeShow(false)}
              />
            ) : null}
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
              onClick={handleAddObject}
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
