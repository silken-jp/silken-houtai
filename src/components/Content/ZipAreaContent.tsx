import React from 'react';
import { useRequest } from 'ahooks';
import { Row, Col, Spin } from 'antd';

import { getZipcodesByState } from '@/services/request/zipcode';
import { getStateZipAreaCodes } from '@/services/request/ziparea';
import CheckBoxGroup from '../Checkbox/ZipAreaCheckModal';

export interface ZipAreaContentProps {
  state: string;
  areaData: any;
}

const ZipAreaContent: React.FC<ZipAreaContentProps> = (props) => {
  const zipcodesApi = useRequest<any>(
    () => getZipcodesByState({ state: props?.state }),
    { refreshDeps: [props?.state] },
  );

  const selectedCodesApi = useRequest<any>(
    () =>
      getStateZipAreaCodes({
        state: props?.state,
        zip_area: props?.areaData?._id,
      }),
    { refreshDeps: [props?.state, props?.areaData?._id] },
  );

  const citySource = zipcodesApi?.data?.filter((item: any) => !item.address);

  if (zipcodesApi?.loading || selectedCodesApi?.loading) return <Spin />;
  if (zipcodesApi?.error || selectedCodesApi?.error) return <>error...</>;

  return (
    <Row>
      {citySource?.map(({ city }: any, key: number) => {
        const dataSource =
          zipcodesApi?.data?.filter(
            (item: any) => item.address && item.city === city,
          ) || [];
        const defaultSelected: string[] =
          selectedCodesApi?.data?.filter((item: any) => {
            dataSource.some((d: any) => d.zipcode === item);
          }) || [];
        const name = `${city} (${defaultSelected.length}/${dataSource?.length})`;
        return (
          <Col span={8} key={key}>
            <CheckBoxGroup
              name={name}
              dataSource={dataSource}
              defaultSelected={defaultSelected}
            />
          </Col>
        );
      })}
    </Row>
  );
};

export default ZipAreaContent;
