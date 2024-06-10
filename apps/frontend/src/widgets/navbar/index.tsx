import qs from 'query-string';
import { useDisclosure } from '@mantine/hooks';
import { useEffect, useState } from 'react';

import { Image } from '@mantine/core';
import logo from 'shared/assets/logo.svg';
import style from './Navbar.module.scss';
import NavbarLinksGroup from './NavbarLinksGroup';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  CREATE_PREDICTION_ROUTE,
  HOME_ROUTE,
  PREDICTION_ROUTE,
} from 'shared/constants/const';
import { PredictionLeaveModal } from 'widgets/prediction-leave-modal';

import { Button } from 'shared/ui/Button';
import PredictionServices from 'shared/services/PredictionServices';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id, isSaved } = qs.parse(location.search);

  const [opened, { open, close }] = useDisclosure(false);
  const [path, setPath] = useState<string>('');

  useEffect(() => {
    if (
      location.pathname !== CREATE_PREDICTION_ROUTE &&
      location.pathname !== PREDICTION_ROUTE &&
      opened
    ) {
      close();
    }
  }, [location, close, opened]);

  const onOpen = (path: string) => {
    setPath(path);
    open();
  };

  const handleSavePrediction = () => {
    if (id) {
      PredictionServices.savePrediction(+id).then(() => {
        navigate(path);
        close();
      });
    }
  };

  return (
    <div className={style.navbar}>
      <div className={style['navbar__header']}>
        <NavLink to={HOME_ROUTE}>
          <Image src={logo} />
        </NavLink>
      </div>
      <NavbarLinksGroup
        isPrediction={
          location.pathname === CREATE_PREDICTION_ROUTE ||
          location.pathname === PREDICTION_ROUTE
        }
        open={
          isSaved ? (path) => navigate(path) : (path: string) => onOpen(path)
        }
      />
      <PredictionLeaveModal
        title={
          location.pathname === CREATE_PREDICTION_ROUTE
            ? 'Вы уверены, что хотите отменить создание прогноза?'
            : 'Вы пытаетесь выйти без сохранения'
        }
        customButtonRow={
          location.pathname === CREATE_PREDICTION_ROUTE ? null : (
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
        opened={opened}
        path={path}
        close={close}
      />
    </div>
  );
};

export default Navbar;
