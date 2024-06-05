import { Flex, Stack } from '@mantine/core';
import { FC } from 'react';
import { NavLink } from 'react-router-dom';
import { authRoutes } from 'shared/constants/routes';

import style from './Navbar.module.scss';
import { IconProps } from '@tabler/icons-react';

interface LinksProps {
  icon?: FC<IconProps>;
  path: string;
  navbarTitle: string;
  Component: FC;
}

interface NavbarLinksGroupProps {
  role: string;
}

const NavbarLink = ({ icon: Icon, path, navbarTitle }: LinksProps) => {
  return (
    <NavLink to={path}>
      <Flex className={style['navbar__link']} align="center" gap={8}>
        {Icon && <Icon stroke={2} />}
        <div>{navbarTitle}</div>
      </Flex>
    </NavLink>
  );
};

const NavbarLinksGroup = ({ role }: NavbarLinksGroupProps) => {
  const links = authRoutes.map((link) => (
    <NavbarLink {...link} key={link.pageTitle} />
  ));

  return (
    <nav style={{ flex: 1 }} id="nav">
      <Stack gap={48}>{links}</Stack>
    </nav>
  );
};

export default NavbarLinksGroup;
