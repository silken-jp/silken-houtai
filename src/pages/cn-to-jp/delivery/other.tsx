import React, { useState } from 'react';
import { Form, Table, Input, Button, Row, Col, Card, Space, Tabs } from 'antd';
import { useAntdTable } from 'ahooks';
import { PageContainer } from '@ant-design/pro-layout';
import dayjs from 'dayjs';
////
import { useIntlFormat } from '@/services/useIntl';
import { deleteConfirm } from '@/components/Common/Actions';
// import { getAllDeliverys, deleteByDeliveryId } from '@/services/request/delivery';

interface DeliveryProps {}

const Delivery: React.FC<DeliveryProps> = (props) => {
  // state
  const [intlMenu] = useIntlFormat('menu');
  return (
    <PageContainer
      header={{
        // title: intlMenu('delivery.other'),
        breadcrumb: {
          routes: [
            {
              path: `/cn-to-jp/delivery/other`,
              breadcrumbName: intlMenu('delivery'),
            },
            { path: '', breadcrumbName: intlMenu('delivery.other') },
          ],
        },
      }}
    >
      <Card title={intlMenu('delivery.other')}></Card>
    </PageContainer>
  );
};

export default Delivery;
