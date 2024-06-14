import { Flex, Image } from '@mantine/core';

import adera from 'shared/assets/adera.svg';

import styles from './Footer.module.scss';
import { GIT_HUB_REPO_LINK, SLIDES_LINK } from 'shared/constants/links';

export const Footer = () => {
  return (
    <Flex align={'center'} p={'32px 0 0'} justify={'space-between'}>
      <Flex align={'center'} gap={12}>
        <Image src={adera} />
        <p className="text black">Решение команды”Адера”</p>
      </Flex>
      <Flex className={styles.links} align={'center'} gap={32}>
        <a
          target="_blank"
          href={GIT_HUB_REPO_LINK}
          className="text"
          rel="noreferrer"
        >
          Ссылка на GitHub{' '}
        </a>
        <a target="_blank" href={SLIDES_LINK} className="text" rel="noreferrer">
          Ссылка на презентацию решения
        </a>
      </Flex>
    </Flex>
  );
};
