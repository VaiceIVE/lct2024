import { Loader, Stack, useMantineTheme } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { IPrediction } from 'shared/models/IPrediction';
import { Breadcrumbs } from 'shared/ui/Breadcrumbs';
import { Notice } from 'shared/ui/Notice';
import { PageWrapper } from 'shared/ui/Wrappers/PageWrapper';
import { EventsList } from 'widgets/events-list';
import { EventsMap } from 'widgets/events-map';
import { PredictionCards } from 'widgets/prediction-cards';
import { PredictionDatePicker } from 'widgets/prediction-date-picker';
import { PredictionLeaveModal } from 'widgets/prediction-leave-modal';
import { PredictionPageNotice } from './components/PredictionPageNotice';

interface PredictionPageProps {
  monthsIndex: number;
  setMonthsIndex: React.Dispatch<React.SetStateAction<number>>;
  months: { label: string; value: string }[];
  isDefault: boolean;
  open: (path: string) => void;
  opened: boolean;
  close: () => void;
  headerActions: React.ReactNode;
  customButtonRow: React.ReactNode | null;
  prediction: IPrediction | null;
  isSaved?: boolean;
  returnPage?: { title: string; href: string };
  id: string | (string | null)[] | null;
  isLoading: boolean;
  isShowNotice?: boolean;
  setShowNotice: React.Dispatch<React.SetStateAction<boolean>>;
}

export const PredictionPage = ({
  months,
  monthsIndex,
  setMonthsIndex,
  isDefault,
  open,
  opened,
  close,
  headerActions,
  customButtonRow,
  isSaved,
  returnPage,
  prediction,
  id,
  isLoading,
  isShowNotice,
  setShowNotice,
}: PredictionPageProps) => {
  const navigate = useNavigate();
  const theme = useMantineTheme();

  return (
    <PageWrapper
      title={isSaved && prediction?.id ? `Прогноз` : ''}
      button={headerActions}
    >
      {isDefault ? null : (
        <Breadcrumbs
          onClick={isSaved ? (path) => navigate(path) : open}
          path={[
            returnPage ? returnPage : { title: 'Базовый прогноз', href: '/' },
            {
              title: isSaved && prediction?.id ? `Прогноз` : 'Новый прогноз',
              href: '/prediction',
            },
          ]}
        />
      )}
      <PredictionDatePicker
        monthsIndex={monthsIndex}
        setMonthsIndex={setMonthsIndex}
        months={months}
        disabled={isLoading}
      />
      {isLoading ? (
        <Stack align="center" flex={1} justify="center">
          <Loader size={'xl'} color={theme.colors.myBlue[2]} />
        </Stack>
      ) : !prediction?.buildings.length ? (
        <p className="text medium">В этом месяце не выявлено никаких событий</p>
      ) : (
        <>
          <PredictionCards
            isLoading={isLoading}
            buildings={prediction?.buildings}
          />
          <EventsMap
            buildings={prediction?.buildings}
            id={id}
            months={months}
            monthsIndex={monthsIndex}
          />
          {prediction?.buildings ? (
            <EventsList
              data={prediction?.buildings}
              id={id}
              month={months[monthsIndex].value}
            />
          ) : null}
          {isShowNotice ? (
            <Notice
              type="done"
              message="Прогноз успешно сохранен"
              isPageNotice
              close={() => setShowNotice(false)}
            />
          ) : null}
          <PredictionLeaveModal
            customButtonRow={customButtonRow}
            title={'Вы уверены, что хотите выйти \n без сохранения прогноза?'}
            text="Все введенные данные не сохранятся. Это действие нельзя будет отменить."
            opened={opened}
            close={close}
          />
        </>
      )}
      <PredictionPageNotice />
    </PageWrapper>
  );
};
