import React from 'react';
import { useRequest } from 'ahooks';
import { Row, Col, Spin } from 'antd';

import {
  getStateZipcodes,
  getStateZipAreaCodes,
} from '@/services/request/ziparea';
import CheckBoxGroup from '../Checkbox/ZipAreaCheckModal';

export interface ZipAreaContentProps {
  state: string;
  areaData: any;
}

// 合并接口
async function getStateApi(params: any) {
  try {
    const src = await getStateZipcodes(params);
    const selected = await getStateZipAreaCodes(params);
    return { src, selected };
  } catch (error) {
    console.log(error);
  }
}

const ZipAreaContent: React.FC<ZipAreaContentProps> = (props) => {
  const { data, loading, error } = useRequest<any>(
    () =>
      getStateApi({
        state: props?.state,
        zip_area: props?.areaData?._id,
      }),
    {
      refreshDeps: [props?.state, props?.areaData?._id],
    },
  );

  const citySource = data?.src?.zipcodes?.filter((item: any) => !item.address);

  if (loading) return <Spin />;
  if (error) return <>error...</>;
  return (
    <Row>
      {citySource?.map(({ city }: any, key: number) => {
        const dataSource =
          data?.src?.zipcodes?.filter(
            (item: any) => item.address && item.city === city,
          ) || [];
        const defaultSelected: string[] =
          data?.selected?.zipcodes?.filter((item: any) => {
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
