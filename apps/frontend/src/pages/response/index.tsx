/* eslint-disable react-hooks/exhaustive-deps */
import { Flex } from '@mantine/core';
import { DateValue } from '@mantine/dates';
import { useDisclosure } from '@mantine/hooks';
import {
  IconChevronLeft,
  IconLayoutGridAdd,
  IconPlus,
} from '@tabler/icons-react';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { debounce } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { months } from 'shared/constants/months';
import { IObj, IResponse } from 'shared/models/IResponse';
import ResponseServices from 'shared/services/ResponseServices';

import { Button } from 'shared/ui/Button';
import { Drawer } from 'shared/ui/Drawer';
import { Notice } from 'shared/ui/Notice';
import { PageWrapper } from 'shared/ui/Wrappers/PageWrapper';

import { EventsMap } from 'widgets/events-map';
import { ResponseCards } from 'widgets/response-cards';
import { ResponseDrawer } from 'widgets/response-drawer';
import { ResponseList } from 'widgets/response-list';

dayjs.extend(customParseFormat);

const data: IResponse = {
  date: '15.10.2024',
  obj: [
    {
      id: 1,
      date: '15.10.2024',
      address: '1Новокосинская улица, 32, Москва, 111672',
      socialType: 'mkd',
      consumersCount: null,
      coords: [55.717482785, 37.828189394],
      event: 'Прорыв трубы',
      priority: 1,
      isLast: true,
    },
    {
      id: 2,
      date: '15.10.2024',
      address: '2Новокосинская улица, 32, Москва, 111672',
      socialType: 'mkd',
      consumersCount: null,
      coords: [55.717482785, 37.828189394],
      event: 'Прорыв трубы',
      priority: 2,
      isLast: true,
    },
    {
      id: 3,
      date: '15.10.2024',
      address: '3Новокосинская улица, 32, Москва, 111672',
      socialType: 'mkd',
      consumersCount: null,
      coords: [55.717482785, 37.828189394],
      event: 'Прорыв трубы',
      priority: 3,
      isLast: true,
    },
  ],
};

const ResponsePage = () => {
  const [opened, { open, close }] = useDisclosure(false);

  const eventFields = useForm();

  const [date, setDate] = useState<DateValue>(null);
  const [response, setResponse] = useState<IResponse | null>(null);
  const [selectedObj, setSelectedObj] = useState<IObj | null>(null);
  const [event, setEvent] = useState('');

  const [isNoticeShow, setNoticeShow] = useState(false);
  const [isPriority, setPriority] = useState(true);

  const debounceDate = useCallback(
    debounce((newState) => changeDefaultDate(newState), 600),
    []
  );

  const getResponse = () => {
    ResponseServices.getResponse().then((response) => {
      setResponse(response.data);
      const format = 'DD MMMM';
      setDate(dayjs(response.data.date, format, 'ru').toDate());
    });
  };

  const handleAddObject = () => {
    const socialType = eventFields.watch('socialType');
    const address = eventFields.watch('address');
    const existingAddresses = response?.obj.map((o) => o.address);

    if (
      !socialType ||
      !address ||
      !event ||
      (existingAddresses?.includes(address) && address !== selectedObj?.address)
    ) {
      setNoticeShow(true);
    } else {
      const addFunction = selectedObj
        ? ResponseServices.changeObj
        : ResponseServices.addObject;

      addFunction(
        socialType,
        event,
        address,
        selectedObj?.id ? selectedObj?.id : 1
      ).then((response) => console.log(response.data));

      close();
    }
  };

  useEffect(() => {
    getResponse();
  }, []);

  const getObjByFilters = () => {
    return response?.obj.sort((a, b) =>
      isPriority ? a.priority - b.priority : b.priority - a.priority
    );
  };

  const clear = useCallback(() => {
    setSelectedObj(null);
    setNoticeShow(false);
    eventFields.setValue('socialType', 'mkd');
    eventFields.setValue('address', '');
    setEvent('');
  }, [eventFields]);

  function changeDefaultDate(date: DateValue | undefined) {
    if (date) {
      ResponseServices.updateDefaultDate(
        dayjs(date).format('DD MMMM').toString()
      ).then((response) => setResponse(response.data));
    }
  }

  useEffect(() => {
    if (selectedObj) {
      open();
    }
  }, [open, selectedObj]);

  useEffect(() => {
    if (!opened) {
      clear();
    }
  }, [clear, opened]);

  useEffect(() => {
    debounceDate(date);
  }, [debounceDate, date]);

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
      {getObjByFilters()?.length ? (
        <ResponseList
          setPriority={setPriority}
          isPriority={isPriority}
          obj={getObjByFilters()}
          setSelectedObj={setSelectedObj}
        />
      ) : null}
      {getObjByFilters()?.length ? (
        <EventsMap data={[]} months={months} monthsIndex={1} id={'3'} />
      ) : null}
      <FormProvider {...eventFields}>
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
                label={selectedObj ? 'Изменить' : 'Добавить'}
                onClick={handleAddObject}
                icon={<IconLayoutGridAdd size={18} />}
              />
            </Flex>
          }
        >
          <ResponseDrawer
            setEvent={setEvent}
            event={event}
            selectedObj={selectedObj}
          />
        </Drawer>
      </FormProvider>
    </PageWrapper>
  );
};

export default ResponsePage;
