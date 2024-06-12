import { Stack, Flex } from '@mantine/core';
import { NavLink } from 'react-router-dom';
import { HOME_ROUTE } from 'shared/constants/const';
import { Button } from 'shared/ui/Button';
import { Modal } from 'shared/ui/Modal';

interface PredictionLeaveModalProps {
  opened: boolean;
  close: () => void;
  path?: string;
  title?: string;
  customButtonRow?: React.ReactNode;
}

export const PredictionLeaveModal = ({
  opened,
  close,
  path,
  title,
  customButtonRow,
}: PredictionLeaveModalProps) => {
  return (
    <Modal opened={opened} close={close} title={title || ''} w={557}>
      <Stack gap={18}>
        <p className="text">
          Все введенные данные не сохранятся. Это действие нельзя будет
          отменить.
        </p>

        <Flex gap={7}>
          {customButtonRow ? (
            customButtonRow
          ) : (
            <>
              <Button onClick={close} fullWidth label="Отмена" />
              <NavLink to={path ? path : HOME_ROUTE}>
                <Button fullWidth label="Подтвердить действие" type="white" />
              </NavLink>
            </>
          )}
        </Flex>
      </Stack>
    </Modal>
  );
};
