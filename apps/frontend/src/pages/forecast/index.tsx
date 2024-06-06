import { useCallback, useEffect, useState } from 'react';
import { debounce } from 'lodash';

import { PageWrapper } from 'shared/ui/Wrappers/PageWrapper';
import { ForecastCards } from 'widgets/forecast-cards';
import { ForecastDatePicker } from 'widgets/forecast-date-picker';
import { EventsList } from 'widgets/events-list';
import { months } from 'shared/constants/months';
import { EventsMap } from 'widgets/events-map';

const ForecastPage = () => {
  const [monthsIndex, setMonthsIndex] = useState(0);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceMonthsIndex = useCallback(
    debounce((newState) => getAnalysisResult(newState), 600),
    []
  );

  function getAnalysisResult(index: number) {
    console.log(months[index].value);
  }

  useEffect(() => {
    debounceMonthsIndex(monthsIndex);
  }, [debounceMonthsIndex, monthsIndex]);

  return (
    <PageWrapper>
      <ForecastDatePicker
        monthsIndex={monthsIndex}
        setMonthsIndex={setMonthsIndex}
      />
      <ForecastCards />
      <EventsMap />
      <EventsList />
    </PageWrapper>
  );
};

export default ForecastPage;
