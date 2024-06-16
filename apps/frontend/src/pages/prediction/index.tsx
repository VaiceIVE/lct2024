import { useCallback, useEffect, useState } from 'react';
import { debounce } from 'lodash';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import qs from 'query-string';

import { months } from 'shared/constants/months';

import { useDisclosure } from '@mantine/hooks';
import { PredictionPage } from './PredictionPage';
import {
  CREATE_PREDICTION_ROUTE,
  HOME_ROUTE,
  PREDICTION_ROUTE,
} from 'shared/constants/const';
import { Button } from 'shared/ui/Button';
import { IconAnalyze, IconChevronLeft, IconPlus } from '@tabler/icons-react';
import { Flex } from '@mantine/core';
import PredictionServices from 'shared/services/PredictionServices';
import { IPrediction } from 'shared/models/IPrediction';
import { FormProvider, useForm } from 'react-hook-form';

const PredictionPageContainer = () => {
  const [opened, { open, close }] = useDisclosure(false);

  const [monthsIndex, setMonthsIndex] = useState(0);
  const [prediction, setPrediction] = useState<IPrediction | null>(null);

  const [path, setPath] = useState<string>('');

  const filterFields = useForm();

  const navigate = useNavigate();
  const location = useLocation();
  const { id, isSaved } = qs.parse(location.search);

  const isDefault = !id;

  const returnPage = location?.state?.returnPage;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceMonthsIndex = useCallback(
    debounce((newState) => getPredictionResult(newState), 600),
    []
  );

  function getPredictionResult(index: number) {
    if (isDefault) {
      PredictionServices.getDefaultPrediction(months[index].value).then(
        (response) => setPrediction(response.data)
      );
    } else {
      PredictionServices.getPredictionById(+id, months[index].value).then(
        (response) => setPrediction(response.data)
      );
    }
  }

  const handleSavePrediction = () => {
    if (id) {
      PredictionServices.savePrediction(+id).then(() => {
        navigate(`${PREDICTION_ROUTE}?id=${id}&isSaved=true`, {
          replace: true,
        });
      });
    }
  };

  const handleLeave = () => {
    navigate(path);
    close();
  };

  const onOpen = (path: string) => {
    setPath(path);
    open();
  };

  useEffect(() => {
    debounceMonthsIndex(monthsIndex);
  }, [debounceMonthsIndex, monthsIndex]);

  return (
    <FormProvider {...filterFields}>
      <PredictionPage
        setMonthsIndex={setMonthsIndex}
        months={months}
        monthsIndex={monthsIndex}
        id={id}
        isDefault={isDefault}
        open={onOpen}
        returnPage={returnPage}
        opened={opened}
        close={close}
        prediction={prediction}
        isSaved={Boolean(isSaved)}
        customButtonRow={
          isDefault ? null : (
            <>
              <Button fullWidth onClick={close} label="Отмена" />
              <Button
                fullWidth
                type="white"
                onClick={handleLeave}
                label="Выйти без сохранения"
              />
            </>
          )
        }
        headerActions={
          isDefault ? (
            <NavLink to={CREATE_PREDICTION_ROUTE}>
              <Button
                label="Создать новый прогноз"
                icon={<IconPlus width={18} height={18} />}
              />
            </NavLink>
          ) : (
            <Flex gap={12}>
              <Button
                type="white"
                isIconLeft
                onClick={
                  isSaved
                    ? () => navigate(HOME_ROUTE)
                    : () => onOpen(HOME_ROUTE)
                }
                label="К Базовому прогнозу"
                icon={<IconChevronLeft width={18} height={18} />}
              />
              {!isSaved ? (
                <Button
                  label="Сохранить"
                  icon={<IconAnalyze width={18} height={18} />}
                  onClick={handleSavePrediction}
                />
              ) : null}
            </Flex>
          )
        }
      />
    </FormProvider>
  );
};

export default PredictionPageContainer;
