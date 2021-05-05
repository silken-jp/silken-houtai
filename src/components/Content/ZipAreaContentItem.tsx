import React, { useImperativeHandle } from 'react';
import { useRequest, useMap } from 'ahooks';
import { Row, Col, Spin } from 'antd';

import { getZipcodesByState } from '@/services/request/zipcode';
import { getZipAreaCodesByState } from '@/services/request/ziparea';
import CheckBoxGroup from '../Checkbox/ZipAreaCheckDrawer';

export interface ZipAreaContentProps {
  state: string;
  zipAreaId: string;
}

const ZipAreaContentItem: React.ForwardRefRenderFunction<
  any,
  ZipAreaContentProps
> = (props, ref) => {
  // state
  // 双向绑定所有的二级drawer, key为city的zipcode，value为address的zipcode[]
  const [zipcodeMap, { set }] = useMap<string | number, string[]>([]);

  // api
  const zipcodesApi = useRequest<any>(
    () => getZipcodesByState({ state: props?.state }),
    {
      refreshDeps: [props?.state],
      formatResult: (res: any) => res.map(({ _id, ...item }: any) => item),
    },
  );
  const selectedCodesApi = useRequest<any>(
    () =>
      getZipAreaCodesByState({
        state: props?.state,
        zipAreaId: props?.zipAreaId,
      }),
    { refreshDeps: [props?.state, props?.zipAreaId] },
  );

  // 指定暴露给父级的方法
  useImperativeHandle(
    ref,
    () => ({
      getZipcodes: () => {
        // 根据zipcodeMap值格式化返回选中的zipcodes
        let codes: any[] = [];
        let count = 0;
        for (const [key, value] of zipcodeMap) {
          if (value.length > 0) {
            codes = [...codes, key, ...value];
            count++;
          }
        }
        const zipcodes: any[] = codes.map((code) => {
          const res = zipcodesApi?.data?.find((d: any) => d.zipcode === code);
          return res;
        });
        return { zipcodes, count };
      },
      resetSelected: (state: string) => {
        // 通过后台重置选择项
        if (state !== props.state) return;
        selectedCodesApi.refresh();
      },
    }),
    [zipcodeMap],
  );

  if (zipcodesApi?.loading || selectedCodesApi?.loading) return <Spin />;
  if (zipcodesApi?.error || selectedCodesApi?.error) return <>error...</>;
  // format
  const citySource = zipcodesApi?.data?.filter((item: any) => !item.address);
  return (
    <Row>
      {citySource?.map(({ zipcode, city }: any, key: number) => {
        const dataSource =
          zipcodesApi?.data?.filter(
            (item: any) => item.address && item.city === city,
          ) || [];
        const defaultSelected: string[] =
          selectedCodesApi?.data?.zipcodes
            ?.filter((item: any) =>
              dataSource.some((d: any) => d.zipcode === item.zipcode),
            )
            ?.map((d: any) => d.zipcode) || [];
        function handleChange(values: any[]) {
          set(zipcode, values);
        }
        return (
          <Col span={12} key={key}>
            <CheckBoxGroup
              name={city}
              dataSource={dataSource}
              defaultSelected={defaultSelected}
              onChange={handleChange}
            />
          </Col>
        );
      })}
    </Row>
  );
};

export default React.forwardRef(ZipAreaContentItem);
