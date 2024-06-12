import { Stack, Flex } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { HOME_ROUTE } from 'shared/constants/const';
import { Button } from 'shared/ui/Button';
import { Modal } from 'shared/ui/Modal';

interface PredictionLeaveModalProps {
  opened: boolean;
  close: () => void;
  path?: string;
  title?: string;
  customButtonRow?: React.ReactNode;
  text?: string;
}

export const PredictionLeaveModal = ({
  opened,
  close,
  path,
  title,
  customButtonRow,
  text,
}: PredictionLeaveModalProps) => {
  const navigate = useNavigate();

  return (
    <Modal opened={opened} close={close} title={title || ''} w={557}>
      <Stack gap={18}>
        <p style={{ whiteSpace: 'pre-line' }} className="text">
          {text}
        </p>
        <Flex gap={7}>
          {customButtonRow ? (
            customButtonRow
          ) : (
            <Flex w={'100%'} align={'center'} gap={7}>
              <Button onClick={close} fullWidth label="Отмена" />
              <Button
                fullWidth
                onClick={() => navigate(path ? path : HOME_ROUTE)}
                type="white"
                label="Выйти из создания"
              />
            </Flex>
          )}
        </Flex>
      </Stack>
    </Modal>
  );
};
