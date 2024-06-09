import { useCallback, useEffect, useState } from 'react';
import { debounce } from 'lodash';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import qs from 'query-string';

import { months } from 'shared/constants/months';

import { useDisclosure } from '@mantine/hooks';
import { PredictionPage } from './PredictionPage';
import { CREATE_PREDICTION_ROUTE, HOME_ROUTE } from 'shared/constants/const';
import { Button } from 'shared/ui/Button';
import { IconAnalyze, IconChevronLeft, IconPlus } from '@tabler/icons-react';
import { Flex } from '@mantine/core';
import PredictionServices from 'shared/services/PredictionServices';
import { IPrediction } from 'shared/models/IPrediction';

const PredictionPageContainer = () => {
  const [opened, { open, close }] = useDisclosure(false);

  const [monthsIndex, setMonthsIndex] = useState(0);
  const [prediction, setPrediction] = useState<IPrediction[]>([]);

  const navigate = useNavigate();
  const location = useLocation();
  const { id } = qs.parse(location.search);

  const isDefault = !id;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceMonthsIndex = useCallback(
    debounce((newState) => getPredictionResult(newState), 600),
    []
  );

  function getPredictionResult(index: number) {
    console.log(id, isDefault);
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
        navigate(HOME_ROUTE);
        close();
      });
    }
  };

  useEffect(() => {
    debounceMonthsIndex(monthsIndex);
  }, [debounceMonthsIndex, monthsIndex]);

  return (
    <PredictionPage
      setMonthsIndex={setMonthsIndex}
      months={months}
      monthsIndex={monthsIndex}
      isDefault={isDefault}
      open={open}
      opened={opened}
      close={close}
      prediction={prediction}
      customButtonRow={
        isDefault ? null : (
          <>
            <Button fullWidth onClick={close} type="white" label="Отмена" />
            <Button
              fullWidth
              onClick={handleSavePrediction}
              label="Сохранить и выйти"
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
              onClick={open}
              label="Отменить создание прогноза"
              icon={<IconChevronLeft width={18} height={18} />}
            />
            <Button
              label="Сохранить"
              icon={<IconAnalyze width={18} height={18} />}
              onClick={handleSavePrediction}
            />
          </Flex>
        )
      }
    />
  );
};

export default PredictionPageContainer;
