import qs from 'query-string';
import { useDisclosure } from '@mantine/hooks';
import { useCallback, useEffect, useMemo, useState } from 'react';

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

  const handleSavePrediction = useCallback(() => {
    if (id) {
      PredictionServices.savePrediction(+id).then(() => {
        navigate(path);
        close();
      });
    }
  }, [close, id, navigate, path]);

  const pagesWithModal = useMemo(
    () => [
      {
        path: CREATE_PREDICTION_ROUTE,
        title: 'Вы уверены, что хотите отменить создание прогноза?',
        customButtonRow: null,
      },
      {
        path: PREDICTION_ROUTE,
        title: 'Вы пытаетесь выйти без сохранения',
        customButtonRow: (
          <>
            <Button fullWidth onClick={close} type="white" label="Отмена" />
            <Button
              fullWidth
              onClick={handleSavePrediction}
              label="Сохранить и выйти"
            />
          </>
        ),
      },
    ],
    [close, handleSavePrediction]
  );

  const onOpen = (path: string) => {
    setPath(path);
    open();
  };

  useEffect(() => {
    if (
      !pagesWithModal.map((p) => p.path).includes(location.pathname) &&
      opened
    ) {
      close();
    }
  }, [location, close, opened, pagesWithModal]);

  return (
    <div className={style.navbar}>
      <div className={style['navbar__header']}>
        <NavLink to={HOME_ROUTE}>
          <Image src={logo} />
        </NavLink>
      </div>
      <NavbarLinksGroup
        isModal={pagesWithModal.map((p) => p.path).includes(location.pathname)}
        open={
          isSaved ? (path) => navigate(path) : (path: string) => onOpen(path)
        }
      />
      <PredictionLeaveModal
        title={pagesWithModal.find((p) => p.path === location.pathname)?.title}
        customButtonRow={
          pagesWithModal.find((p) => p.path === location.pathname)
            ?.customButtonRow
        }
        opened={opened}
        path={path}
        close={close}
      />
    </div>
  );
};

export default Navbar;
