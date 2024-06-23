/* eslint-disable @typescript-eslint/no-non-null-assertion */
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
import { debounce, isNull } from 'lodash';
import { useCallback, useContext, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { months } from 'shared/constants/months';
import { findSquareForHouse } from 'shared/helpers';
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
import { PageNotice } from '../../shared/ui/PageNotice';
import { observer } from 'mobx-react-lite';
import { Context } from 'main';
import { responseData } from 'shared/constants/mock';

dayjs.extend(customParseFormat);

const ResponsePage = observer(() => {
  const [opened, { open, close }] = useDisclosure(false);

  const theme = useMantineTheme();

  const { UStore } = useContext(Context);

  const eventFields = useForm();

  const [date, setDate] = useState<DateValue>(null);
  const [response, setResponse] = useState<IResponse | null>(null);
  const [selectedObj, setSelectedObj] = useState<IObj | null>(null);
  const [event, setEvent] = useState('');

  const [tpAddresses, setTpAddresses] = useState<
    { value: string; label: string }[]
  >([]);

  const [isNoticeShow, setNoticeShow] = useState<boolean>(false);
  const [isPriority, setPriority] = useState<boolean>(true);
  const [isLoading, setLoading] = useState<boolean>(false);

  const [isPageNoticeShow, setPageNoticeShow] = useState(false);

  const [deletedId, setDeletedId] = useState<number>();

  const debounceDate = useCallback(
    debounce((newState) => changeDefaultDate(newState), 600),
    []
  );

  const getResponse = () => {
    setResponse(responseData);
    // setLoading(true);
    // ResponseServices.getResponse()
    //   .then((response) => {
    //     setResponse({
    //       date: response.data.date,
    //       obj: response.data?.obj.map((o) => ({
    //         ...o,
    //         connectionInfo: isNull(o.coords)
    //           ? null
    //           : findSquareForHouse(o.coords),
    //       })),
    //     });
    //     const format = 'DD MMMM';
    //     if (response.data.date !== dayjs(date).format('DD MMMM').toString()) {
    //       setDate(
    //         dayjs(response.data.date.toLocaleLowerCase(), format, 'ru').toDate()
    //       );
    //     }
    //   })
    //   .finally(() => {
    //     setLoading(false);
    //   });
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
        .then(() => getResponse())
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

  const handleDeleteObject = () => {
    if (deletedId) {
      setLoading(true);
      ResponseServices.deleteObj(deletedId)
        .then((response) => {
          setResponse(response.data);
        })
        .finally(() => {
          setLoading(false);
          setDeletedId(undefined);
        });
    }
  };

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

  useEffect(() => {
    const getUniqueAddresses = (items: IObj[]) => {
      return Array.from(
        new Set(
          items
            .filter((item) => item.connectionInfo?.address)
            .map((item) => ({
              value: item.connectionInfo!.address!,
              label: item.connectionInfo!.address!,
            }))
        )
      );
    };

    if (response?.obj.length) {
      const uniqTp = getUniqueAddresses(response.obj);
      setTpAddresses(uniqTp);
    }

    setPageNoticeShow(true);
  }, [response]);

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
            setDeletedId={setDeletedId}
            handleDeleteObject={handleDeleteObject}
            tpAddresses={tpAddresses}
          />
        ) : null}
        {response?.obj?.length && !isLoading ? (
          <EventsMap
            isResponse
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
      {!UStore.isNoticeHide &&
      isPageNoticeShow &&
      response?.obj.filter((o) => o.isLast).length ? (
        <Notice
          message="text"
          type="error"
          w={520}
          isPageNotice
          close={() => setPageNoticeShow(false)}
        >
          <PageNotice
            setPageNoticeShow={setPageNoticeShow}
            obj={response?.obj.filter((o) => o.isLast)[0]}
          />
        </Notice>
      ) : null}
    </PageWrapper>
  );
});

export default ResponsePage;
