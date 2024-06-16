/* eslint-disable react-hooks/exhaustive-deps */
import { Flex, Loader, useMantineTheme } from '@mantine/core';
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
      isLast: false,
      fullCooldown: 3,
      normCooldown: 2,
      district: 'Восточное Измайлово',
    },
    {
      id: 2,
      date: '15.10.2024',
      address: '2Новокосинская улица, 32, Москва, 111672',
      socialType: 'education',
      consumersCount: null,
      coords: [55.720046086, 37.797663794],
      event: 'Прорыв трубы',
      priority: 2,
      isLast: false,
      fullCooldown: 3,
      normCooldown: 2,
      district: 'муниципальный округ Преображенское',
    },
    {
      id: 3,
      date: '15.10.2024',
      address: '3Новокосинская улица, 32, Москва, 111672',
      socialType: 'tp',
      consumersCount: 190,
      coords: [55.815345188, 37.514882646],
      event: 'Прорыв трубы',
      priority: 3,
      isLast: true,
      fullCooldown: 3,
      normCooldown: 2,
      district: 'муниципальный округ Преображенское',
    },
  ],
};

const ResponsePage = () => {
  const [opened, { open, close }] = useDisclosure(false);

  const theme = useMantineTheme();

  const eventFields = useForm();

  const [date, setDate] = useState<DateValue>(null);
  const [response, setResponse] = useState<IResponse | null>(null);
  const [selectedObj, setSelectedObj] = useState<IObj | null>(null);
  const [event, setEvent] = useState('');

  const [isNoticeShow, setNoticeShow] = useState<boolean>(false);
  const [isPriority, setPriority] = useState<boolean>(true);
  const [isLoading, setLoading] = useState<boolean>(false);

  const debounceDate = useCallback(
    debounce((newState) => changeDefaultDate(newState), 600),
    []
  );

  const getResponse = () => {
    setLoading(true);
    ResponseServices.getResponse()
      .then((response) => {
        setResponse(response.data);
        const format = 'DD MMMM';
        setDate(
          dayjs(response.data.date.toLocaleLowerCase(), format, 'ru').toDate()
        );
      })
      .finally(() => setLoading(false));
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
      setLoading(true);
      const addFunction = selectedObj
        ? ResponseServices.changeObj
        : ResponseServices.addObject;

      addFunction(
        socialType,
        event,
        address,
        selectedObj?.id ? selectedObj?.id : 1
      )
        .then((response) => setResponse(response.data))
        .finally(() => setLoading(false));

      close();
    }
  };

  useEffect(() => {
    getResponse();
  }, []);

  const getObjByFilters = () => {
    return response?.obj
      .sort((a, b) =>
        isPriority ? b.priority - a.priority : a.priority - b.priority
      )
      .filter(
        (b) =>
          !eventFields.watch('district') ||
          b.district === eventFields.watch('district')
      )
      .filter(
        (b) =>
          !eventFields.watch('filterSocialType') ||
          b.socialType === eventFields.watch('filterSocialType')
      );
  };

  const clear = useCallback(() => {
    setSelectedObj(null);
    setNoticeShow(false);
    eventFields.setValue('socialType', 'mkd');
    eventFields.setValue('address', '');
    setEvent('');
  }, [eventFields]);

  function changeDefaultDate(date: string) {
    if (date) {
      setLoading(true);
      ResponseServices.updateDefaultDate(
        dayjs(date).format('DD MMMM').toString()
      )
        .then((response) => setResponse(response.data))
        .finally(() => setLoading(false));
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
      <ResponseCards
        isLoading={isLoading}
        obj={response?.obj}
        setDate={setDate}
        date={date}
      />
      {isLoading ? (
        <Flex flex={1} align={'center'} justify={'center'}>
          <Loader size={'xl'} color={theme.colors.myBlue[2]} />
        </Flex>
      ) : null}
      <FormProvider {...eventFields}>
        {response?.obj?.length && !isLoading ? (
          <ResponseList
            date={response?.date}
            setPriority={setPriority}
            isPriority={isPriority}
            obj={getObjByFilters()}
            setSelectedObj={setSelectedObj}
          />
        ) : null}
        {response?.obj?.length && !isLoading ? (
          <EventsMap
            title="Все инциденты на карте"
            objs={response?.obj}
            months={months}
            monthsIndex={1}
            id={'3'}
          />
        ) : null}
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
