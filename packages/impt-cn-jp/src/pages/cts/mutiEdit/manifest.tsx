import { Table, Card, Space, Form, Input, Button } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
////
import CTSSearch from '@/components/Search/CTSSearch';
import CTSStatus from '@/components/Common/CTSStatus';
import { useIntlFormat } from '@/services/useIntl';
import { useCTS } from '@/services/useCTS';
import { manifestItems } from '../check/components/Form/MICForm';
import { useEffect } from 'react';

const ManifestWaybill: React.FC = () => {
  const [tableForm] = Form.useForm();
  const [intlMenu] = useIntlFormat('menu');
  const { form, state, tableProps, search, cardProps } = useCTS('M');

  const InputColumn = ({ limit, name, no }: any) => ({
    title: no + '.' + name,
    width: limit * 10 + (limit > 20 ? 50 : 20),
    render: (row: any) => (
      <Form.Item
        className="form-hidden-message"
        style={{ marginBottom: 0 }}
        rules={[{ max: limit }]}
        name={[row?._id, name]}
        initialValue={row[name]}
      >
        <Input />
      </Form.Item>
    ),
  });

  const columns = manifestItems?.flatMap?.((items) =>
    items?.length > 0 ? items?.map((item) => InputColumn(item)) : [],
  );

  useEffect(() => {
    tableForm.validateFields();
  }, [tableProps.loading]);

  return (
    <PageContainer
      header={{
        title: 'Manifest',
        breadcrumb: {
          routes: [
            { path: `/cts/manifest`, breadcrumbName: intlMenu('cts') },
            { path: '', breadcrumbName: 'Manifest' },
          ],
        },
      }}
    >
      <CTSSearch form={form} search={search} />

      <CTSStatus
        dataSource={state.meta}
        loading={tableProps?.loading}
        type="MIC"
      />

      <Form name="tableForm" form={tableForm}>
        <Card
          {...cardProps}
          tabBarExtraContent={
            <Space>
              <Button type="primary" onClick={() => tableForm.validateFields()}>
                保存
              </Button>
            </Space>
          }
        >
          <Table
            size="small"
            rowKey="_id"
            {...tableProps}
            rowSelection={undefined}
            columns={columns}
            scroll={{ x: 10000 }}
          />
        </Card>
      </Form>
    </PageContainer>
  );
};

export default ManifestWaybill;
