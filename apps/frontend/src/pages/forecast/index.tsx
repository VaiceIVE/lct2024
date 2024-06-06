import { PageWrapper } from 'shared/ui/Wrappers/PageWrapper';
import { ForecastCards } from 'widgets/forecast-cards';
import { ForecastList } from 'widgets/forecast-list';
import { ForecastMap } from 'widgets/forecast-map';

const ForecastPage = () => {
  return (
    <PageWrapper>
      <ForecastCards />
      <ForecastMap />
      <ForecastList />
    </PageWrapper>
  );
};

export default ForecastPage;
