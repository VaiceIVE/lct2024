import { useNavigate } from 'react-router-dom';
import { IPrediction } from 'shared/models/IPrediction';
import { Breadcrumbs } from 'shared/ui/Breadcrumbs';
import { PageWrapper } from 'shared/ui/Wrappers/PageWrapper';
import { EventsList } from 'widgets/events-list';
import { EventsMap } from 'widgets/events-map';
import { PredictionCards } from 'widgets/prediction-cards';
import { PredictionDatePicker } from 'widgets/prediction-date-picker';
import { PredictionLeaveModal } from 'widgets/prediction-leave-modal';

interface PredictionPageProps {
  monthsIndex: number;
  setMonthsIndex: React.Dispatch<React.SetStateAction<number>>;
  months: { label: string; value: number }[];
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
}: PredictionPageProps) => {
  const navigate = useNavigate();

  return (
    <PageWrapper
      title={isSaved && prediction?.id ? `Анализ от ${1}` : ''}
      button={headerActions}
    >
      {isDefault ? null : (
        <Breadcrumbs
          onClick={isSaved ? (path) => navigate(path) : open}
          path={[
            returnPage ? returnPage : { title: 'Базовый прогноз', href: '/' },
            {
              title:
                isSaved && prediction?.id ? `Анализ от ${1}` : 'Новый прогноз',
              href: '/prediction',
            },
          ]}
        />
      )}
      <PredictionDatePicker
        monthsIndex={monthsIndex}
        setMonthsIndex={setMonthsIndex}
        months={months}
      />
      <PredictionCards />
      <EventsMap id={id} months={months} monthsIndex={monthsIndex} />
      <EventsList id={id} month={months[monthsIndex].value} />
      <PredictionLeaveModal
        customButtonRow={customButtonRow}
        title={'Вы уверены, что хотите выйти \n без сохранения прогноза?'}
        text="Все введенные данные не сохранятся. Это действие нельзя будет отменить."
        opened={opened}
        close={close}
      />
    </PageWrapper>
  );
};
