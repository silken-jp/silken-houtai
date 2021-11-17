import React from 'react';
import { Card, Button, Form, List } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { useSKForm } from '@silken-houtai/core/lib/useHooks';
////
import BlackListForm from '@/components/Form/BlackListForm';
import { useIntlFormat } from '@/services/useIntl';

const BlackList: React.FC = () => {
  // state
  const [form] = Form.useForm();
  const [intlMenu] = useIntlFormat('menu');
  const { formType, formProps, handleOpen } = useSKForm.useForm<API.MICkeys>();

  // action
  function handleEdit(e: any) {
    handleOpen({ title: e?.currentTarget?.dataset?.title, type: 'add', data: null });
  }
  function handleSubmit(v: any) {
    console.log(v);
  }

  // Todo: form改为单个Input.TextArea。
  return (
    <PageContainer
      header={{
        title: 'ブラックリスト',
        breadcrumb: {
          routes: [
            { path: '/cts/settings/BlackList', breadcrumbName: intlMenu('setting') },
            { path: '', breadcrumbName: 'ブラックリスト' },
          ],
        },
      }}
    >
      <BlackListForm type={formType} {...formProps} onSubmit={handleSubmit} />
      <Card title="輸出ブラックリスト">
        <List
          size="small"
          dataSource={[
            { key: 0, title: '依頼者' },
            { key: 1, title: '品名' },
            { key: 2, title: '国コード' },
            { key: 3, title: '国連LOCODE' },
          ]}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Button data-title={'輸出' + item?.title} onClick={handleEdit} size="small" type="link">
                  編集
                </Button>,
              ]}
            >
              <List.Item.Meta title={item.title} description="words" />
            </List.Item>
          )}
        />
      </Card>
      <br />
      <Card title="輸入ブラックリスト">
        <List
          size="small"
          dataSource={[
            { key: 0, title: '依頼者' },
            { key: 1, title: '品名' },
            { key: 2, title: '国コード' },
            { key: 3, title: '国連LOCODE' },
          ]}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Button data-title={'輸入' + item?.title} onClick={handleEdit} size="small" type="link">
                  編集
                </Button>,
              ]}
            >
              <List.Item.Meta title={item.title} description="words" />
            </List.Item>
          )}
        />
      </Card>
    </PageContainer>
  );
};

export default BlackList;
