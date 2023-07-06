import {
  Form,
  Table,
  Card,
  Row,
  Col,
  Input,
  Button,
  Space,
  Select,
} from 'antd';
import { useAntdTable, useRequest } from 'ahooks';
import { PageContainer } from '@ant-design/pro-layout';
import { useState } from 'react';
////
import GenEDIText from '../components/GenEDIText';
import { dayFormat } from '@/utils/helper/day';
import UploadDeliveryFile from '@/components/Common/UploadDeliveryFile';
import { useIntlFormat } from '@/services/useIntl';
import { getAllEDIs } from '@/services/request/edi-put';
// import { importMultiTracks } from '@/services/request/track';
import { useAgentOptions, useUserOptions } from '@/services/useAPIOption';

interface DeliveryProps {}

const Delivery: React.FC<DeliveryProps> = (props) => {
  // state
  const [form] = Form.useForm();
  const [intlMenu] = useIntlFormat('menu');
  const [tabKey, setTabKey] = useState('');
  const { agentOptions } = useAgentOptions({
    fieldNames: {
      label: 'tab',
      value: 'key',
    },
    onSuccess: (data) => {
      setTabKey(data?.agents?.[0]?._id || '');
      search.submit();
    },
  });
  const { userOptions } = useUserOptions();

  // api
  const getTableData = async (pageData: any, formData: any) => {
    const page = pageData.current - 1;
    const perPage = pageData.pageSize;
    const data = await getAllEDIs({
      page,
      perPage,
      sortField: 'createdAt',
      sortOrder: -1,
      ...formData,
      put_to: 'sagawa',
      agent: tabKey,
    });
    return {
      total: data?.totalCount,
      list: data?.ediPuts || [],
    };
  };
  const { tableProps, search, refresh } = useAntdTable(getTableData, {
    form,
    manual: true,
  });
  // const importAPI = useRequest(importMultiTracks, {
  //   manual: true,
  // });

  // action
  const handleTabChange = (key: any) => {
    setTabKey(key);
    search.submit();
  };

  return (
    <PageContainer
      header={{
        breadcrumb: {
          routes: [
            { path: `/delivery/other`, breadcrumbName: intlMenu('delivery') },
            { path: '', breadcrumbName: 'EDI' },
          ],
        },
      }}
      extra={<GenEDIText type="sagawa" />}
    >
      <Form form={form} className="sk-table-search">
        <Row justify="end" gutter={16}>
          <Col flex="200px">
            <Form.Item name="MAB">
              <Input placeholder="MAB" />
            </Form.Item>
          </Col>
          <Col flex="200px">
            <Form.Item name="filename">
              <Input placeholder="ファイル名" />
            </Form.Item>
          </Col>
          <Col flex="200px">
            <Form.Item name="uploader">
              <Select
                placeholder="アップローダー"
                allowClear
                options={userOptions}
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item>
              <Space>
                <Button type="primary" onClick={search.submit}>
                  検索
                </Button>
                <Button onClick={search.reset}>リセット</Button>
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Card
        activeTabKey={tabKey}
        tabList={agentOptions}
        onTabChange={handleTabChange}
        // tabBarExtraContent={
        //   <Button
        //     type="primary"
        //     loading={importAPI.loading}
        //     onClick={importAPI.run}
        //   >
        //     更新
        //   </Button>
        // }
      >
        <Table
          title={() => (
            <UploadDeliveryFile
              putTo="sagawa"
              refresh={refresh}
              agent={tabKey}
            />
          )}
          expandable={{
            expandedRowRender: (row) => (
              <p>未送信のHAWB：{row?.unsent_hawbs?.join(' ')}</p>
            ),
          }}
          {...tableProps}
          rowKey="_id"
          scroll={{ y: 400 }}
        >
          <Table.Column
            title="フォワーダー"
            width={200}
            render={(row) =>
              agentOptions?.find((item) => item.value === row?.agent)?.label
            }
          />
          <Table.Column title="ファイル名" width={200} dataIndex="filename" />
          <Table.Column title="MAB" width={200} dataIndex="MAB" />
          <Table.Column title="STATUS" width={200} dataIndex="EXA_DIS_in" />
          <Table.Column
            title="件数"
            width={200}
            render={(row) => `${row?.hawb_count} / ${row?.mawb_count}`}
          />
          <Table.Column
            title="アップローダー"
            width={200}
            dataIndex="uploader"
            render={(uploader) =>
              userOptions?.find((item) => item.value === uploader)?.label
            }
          />
          <Table.Column
            title="アップロード時間"
            width={200}
            dataIndex="createdAt"
            render={(createdAt) => dayFormat(createdAt)}
          />
        </Table>
      </Card>
    </PageContainer>
  );
};

export default Delivery;
