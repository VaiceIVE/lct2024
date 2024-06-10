import { Flex, Stack } from '@mantine/core';
import { FC } from 'react';
import { NavLink } from 'react-router-dom';
import { authRoutes } from 'shared/constants/routes';

import style from './Navbar.module.scss';
import { Icon, IconProps } from '@tabler/icons-react';

interface LinksProps {
  icon?: React.ForwardRefExoticComponent<
    IconProps & React.RefAttributes<Icon>
  > | null;
  path: string;
  navbarTitle?: string | null;
  Component?: FC;
  pageTitle?: string;
  isModal?: boolean;
  open: (path: string) => void;
}

const NavbarLink = ({
  icon: Icon,
  path,
  navbarTitle,
  isModal,
  open,
}: LinksProps) => {
  const icon = (
    <Flex className={style['navbar__link']} align="center" gap={8}>
      {Icon && <Icon stroke={2} />}
      <div>{navbarTitle}</div>
    </Flex>
  );

  return isModal ? (
    <div className={style['navbar__modal-link']} onClick={() => open(path)}>
      {icon}
    </div>
  ) : (
    <NavLink to={path}>{icon}</NavLink>
  );
};

interface NavbarLinksGroupProps {
  isModal: boolean;
  open: (path: string) => void;
}

const NavbarLinksGroup = ({ isModal, open }: NavbarLinksGroupProps) => {
  const links = authRoutes.map((link, index) => (
    <NavbarLink {...link} key={index} isModal={isModal} open={open} />
  ));

  return (
    <nav style={{ flex: 1 }} id="nav">
      <Stack gap={48}>{links}</Stack>
    </nav>
  );
};

export default NavbarLinksGroup;
