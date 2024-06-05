import { Image } from '@mantine/core';
import logo from 'shared/assets/logo.svg';
import style from './Navbar.module.scss';
import NavbarLinksGroup from './NavbarLinksGroup';
import { NavLink } from 'react-router-dom';
import { HOME_ROUTE } from 'shared/constants/const';
import { useContext } from 'react';
import { Context } from 'main';

const Navbar = () => {
  const { UStore } = useContext(Context);

  return (
    <div className={style.navbar}>
      <div className={style['navbar__header']}>
        <NavLink to={HOME_ROUTE}>
          <Image src={logo} />
        </NavLink>
      </div>
      <NavbarLinksGroup role={UStore.user.role} />
    </div>
  );
};

export default Navbar;
