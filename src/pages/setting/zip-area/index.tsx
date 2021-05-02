import React, { useState } from 'react';
import { Collapse, Row, Col, Card, Empty } from 'antd';

import ZipAreaSider from '@/components/Sider/ZipAreaSider';
import ZipAreaContent from '@/components/Content/ZipAreaContent';

const states = ['东京', '西南', '华北', '华中', '华东', '华南', '华北'];

export interface ZipAreaProps {}

const ZipArea: React.FC<ZipAreaProps> = () => {
  const [areaData, setAreaData] = useState<any>();
  return (
    <Row gutter={12} wrap={false}>
      <Col flex="210px">
        <ZipAreaSider onChange={(item: any) => setAreaData(item)} />
      </Col>
      <Col flex="auto">
        {areaData?.name ? (
          <Card title={areaData?.name}>
            <Collapse>
              {states.map((state, key) => {
                const cities = areaData?.cities?.filter(
                  (area: any) => area.state === state,
                );
                return (
                  <Collapse.Panel
                    key={key}
                    header={`${state}（${cities?.length || 0}）`}
                  >
                    <ZipAreaContent
                      key={key}
                      state={state}
                      areaData={areaData}
                    />
                  </Collapse.Panel>
                );
              })}
            </Collapse>
          </Card>
        ) : (
          <Empty description={false} />
        )}
      </Col>
    </Row>
  );
};

export default ZipArea;
