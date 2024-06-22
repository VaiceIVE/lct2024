import { isNull } from 'lodash';
import { Context } from 'main';
import { observer } from 'mobx-react-lite';
import { useContext, useEffect, useState } from 'react';
import { responseData } from 'shared/constants/mock';
import { findSquareForHouse } from 'shared/helpers';
import { IResponse } from 'shared/models/IResponse';
import ResponseServices from 'shared/services/ResponseServices';
import { Notice } from 'shared/ui/Notice';
import { PageNotice } from 'shared/ui/PageNotice';

export const PredictionPageNotice = observer(() => {
  const [response, setResponse] = useState<IResponse>();
  const [isPageNoticeShow, setPageNoticeShow] = useState(false);

  const { UStore } = useContext(Context);

  const getResponse = () => {
    setResponse({
      date: responseData.date,
      obj: responseData?.obj.map((o) => ({
        ...o,
        connectionInfo: isNull(o.coords) ? null : findSquareForHouse(o.coords),
      })),
    });
    // ResponseServices.getResponse()
    //   .then((response) => {
    //     setResponse({
    //       date: response.data.date,
    //       obj: response.data?.obj.map((o) => ({
    //         ...o,
    //         connectionInfo: isNull(o.coords)
    //           ? null
    //           : findSquareForHouse(o.coords),
    //       })),
    //     });
    //   })
    //   .finally(() => {
    //     setPageNoticeShow(true);
    //   });
  };

  useEffect(() => {
    getResponse();
  }, []);

  useEffect(() => {
    setPageNoticeShow(true);
  }, [response]);

  return !UStore.isNoticeHide &&
    isPageNoticeShow &&
    response?.obj.filter((o) => o.isLast).length ? (
    <Notice
      message="text"
      type="error"
      w={520}
      isPageNotice
      close={() => setPageNoticeShow(false)}
    >
      <PageNotice
        setPageNoticeShow={setPageNoticeShow}
        obj={response?.obj.filter((o) => o.isLast)[0]}
      />
    </Notice>
  ) : null;
});
