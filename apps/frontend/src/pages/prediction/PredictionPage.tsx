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
  open: () => void;
  opened: boolean;
  close: () => void;
  headerActions: React.ReactNode;
  customButtonRow: React.ReactNode | null;
  prediction: IPrediction[];
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
}: PredictionPageProps) => {
  return (
    <PageWrapper button={headerActions}>
      {isDefault ? null : (
        <Breadcrumbs
          onClick={open}
          path={[
            { title: 'Базовый прогноз', href: '/' },
            { title: 'Новый прогноз', href: '/create-prediction' },
          ]}
        />
      )}
      <PredictionDatePicker
        monthsIndex={monthsIndex}
        setMonthsIndex={setMonthsIndex}
        months={months}
      />
      <PredictionCards />
      <EventsMap />
      <EventsList />
      <PredictionLeaveModal
        customButtonRow={customButtonRow}
        title={'Вы пытаетесь выйти без сохранения'}
        opened={opened}
        close={close}
      />
    </PageWrapper>
  );
};
