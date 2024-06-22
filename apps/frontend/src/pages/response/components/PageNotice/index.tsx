import { CloseIcon, Flex, Stack, useMantineTheme } from '@mantine/core';
import { IconAlertCircleFilled, IconArrowRight } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { simpleBuildingTypes } from 'shared/constants/buildingTypes';
import { MAP_ROUTE } from 'shared/constants/const';
import { IObj } from 'shared/models/IResponse';
import { Title } from 'shared/ui/Title';

interface PageNoticeProps {
  obj: IObj;
  setPageNoticeShow: (value: boolean) => void;
}

export const PageNotice = ({ obj, setPageNoticeShow }: PageNoticeProps) => {
  const theme = useMantineTheme();

  const navigate = useNavigate();

  return (
    <Stack gap={20}>
      <Flex align={'center'} justify={'space-between'}>
        <IconAlertCircleFilled size={24} color={theme.colors.myState[1]} />
        <CloseIcon
          onClick={() => setPageNoticeShow(false)}
          cursor={'pointer'}
          size="24px"
          color={theme.colors.myBlack[3]}
        />
      </Flex>
      <Title level={4} title={obj.address} />
      <Flex justify={'space-between'} align={'flex-end'}>
        <Stack gap={8}>
          {obj.socialType ? (
            <p className="text">
              Тип:{' '}
              <span className="text medium">
                {simpleBuildingTypes[obj.socialType]}
              </span>
            </p>
          ) : null}
          <p className="text">
            Потребители:{' '}
            <span className="text medium">
              {obj.consumersCount ? obj.consumersCount : 1}
            </span>
          </p>
          {obj.fullCooldown ? (
            <p className="text">
              Полное остывание трубы:{' '}
              <span className="text medium">
                Через {obj.fullCooldown?.toFixed(2)} часа
              </span>
            </p>
          ) : null}
          {obj.normCooldown ? (
            <p className="text">
              Нормативное остывание трубы:{' '}
              <span className="text medium">
                Через {obj.normCooldown?.toFixed(2)} часа
              </span>
            </p>
          ) : null}
        </Stack>
        <IconArrowRight
          cursor={'pointer'}
          onClick={() =>
            navigate(`${MAP_ROUTE}?isResponse=true`, { state: { obj } })
          }
          size={24}
          color={theme.colors.myState[1]}
        />
      </Flex>
    </Stack>
  );
};
