import { useNavigate } from 'react-router-dom';
import { IBuilding } from 'shared/models/IBuilding';
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

const data: IBuilding[] = [
  {
    address: 'Новокосинская улица, 32, Москва, 111672',
    events: [
      {
        eventName: 'Сильная течь в системе отопления',
        chance: 50,
        date: '12.06',
      },
      { eventName: 'P1 <= 0', chance: 90, date: '12.06' },
    ],
    socialType: 'mkd',
    coords: [55.717482785, 37.828189394],
    coolingRate: 3,
    consumersCount: null,
    priority: 1,
  },
  {
    address: 'Новокосинская улица, 32, Москва, 111673',
    events: [
      {
        eventName: 'Сильная течь в системе отопления',
        chance: 50,
        date: '12.06',
      },
      { eventName: 'P1 <= 0', chance: 20, date: '12.06' },
    ],
    socialType: 'medicine',
    coords: [55.803579031, 37.513482336],
    coolingRate: 5,
    consumersCount: null,
    priority: 2,
  },
  {
    address: 'Новокосинская улица, 32, Москва, 123',
    events: [
      {
        eventName: 'Сильная течь в системе отопления',
        chance: 50,
        date: '12.06',
      },
      { eventName: 'P1 <= 0', chance: 20, date: '12.06' },
    ],
    socialType: 'medicine',
    coords: [55.720046086, 37.797663794],
    coolingRate: 5,
    consumersCount: null,
    priority: 3,
  },
];

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
      <EventsMap
        data={data}
        id={id}
        months={months}
        monthsIndex={monthsIndex}
      />
      <EventsList data={data} id={id} month={months[monthsIndex].value} />
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
