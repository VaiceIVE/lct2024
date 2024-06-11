import { Flex, Stack } from '@mantine/core';
import { FC } from 'react';
import { NavLink } from 'react-router-dom';
import { authRoutes } from 'shared/constants/routes';

import styles from './Navbar.module.scss';
import { Icon, IconProps } from '@tabler/icons-react';
import classNames from 'classnames';

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
  activePaths?: string[];
  currentPath: string;
}

const NavbarLink = ({
  icon: Icon,
  path,
  navbarTitle,
  isModal,
  currentPath,
  activePaths,
  open,
}: LinksProps) => {
  const icon = (
    <Flex
      className={classNames(styles['navbar__link'], {
        [styles.active]: activePaths?.includes(currentPath),
      })}
      align="center"
      gap={8}
    >
      {Icon && <Icon stroke={2} />}
      <div>{navbarTitle}</div>
    </Flex>
  );

  return isModal ? (
    <div className={styles['navbar__modal-link']} onClick={() => open(path)}>
      {icon}
    </div>
  ) : (
    <NavLink to={path}>{icon}</NavLink>
  );
};

interface NavbarLinksGroupProps {
  isModal: boolean;
  open: (path: string) => void;
  currentPath: string;
}

const NavbarLinksGroup = ({
  isModal,
  open,
  currentPath,
}: NavbarLinksGroupProps) => {
  const links = authRoutes.map((link, index) => (
    <NavbarLink
      {...link}
      key={index}
      currentPath={currentPath}
      isModal={isModal}
      open={open}
    />
  ));

  return (
    <nav style={{ flex: 1 }} id="nav">
      <Stack gap={48}>{links}</Stack>
    </nav>
  );
};

export default NavbarLinksGroup;
