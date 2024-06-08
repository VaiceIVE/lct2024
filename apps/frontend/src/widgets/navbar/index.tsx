import { Image } from '@mantine/core';
import logo from 'shared/assets/logo.svg';
import style from './Navbar.module.scss';
import NavbarLinksGroup from './NavbarLinksGroup';
import { NavLink, useLocation } from 'react-router-dom';
import { CREATE_PREDICTION_ROUTE, HOME_ROUTE } from 'shared/constants/const';
import { PredictionLeaveModal } from 'widgets/prediction-leave-modal';
import { useDisclosure } from '@mantine/hooks';
import { useEffect, useState } from 'react';

const Navbar = () => {
  const location = useLocation();
  const [opened, { open, close }] = useDisclosure(false);
  const [link, setLink] = useState<string>('');

  useEffect(() => {
    if (location.pathname !== CREATE_PREDICTION_ROUTE && opened) {
      close();
    }
  }, [location, close, opened]);

  const onOpen = (path: string) => {
    setLink(path);
    open();
  };

  return (
    <div className={style.navbar}>
      <div className={style['navbar__header']}>
        <NavLink to={HOME_ROUTE}>
          <Image src={logo} />
        </NavLink>
      </div>
      <NavbarLinksGroup
        isPrediction={location.pathname === CREATE_PREDICTION_ROUTE}
        open={onOpen}
      />
      <PredictionLeaveModal opened={opened} link={link} close={close} />
    </div>
  );
};

export default Navbar;
