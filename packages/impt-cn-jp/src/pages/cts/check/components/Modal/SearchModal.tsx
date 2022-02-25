import { useState, useEffect } from 'react';
import { Modal, Descriptions, Radio, Input, Space, Button, Table, Form } from 'antd';
import { TableRowSelection } from 'antd/lib/table/interface';
import { useKeyPress, useAntdTable } from 'ahooks';
///
import { getImporters } from '@/services/request/importer';

export interface SearchModalProps {
  form: any;
}

const SearchModal: React.FC<SearchModalProps> = (props) => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [changeType, setChangeType] = useState(3);
  const [selectedRows, setSelectedRows] = useState<API.Importer[]>([]);

  // query
  const getTableData = async (pageData: any, formData: any): Promise<any> => {
    const data = await getImporters({
      page: pageData?.current - 1,
      perPage: pageData?.pageSize,
      // ...formData,
      imp_code: formData?.ImpCode,
      company_name_en: formData?.ImpName,
      phone: formData?.Tel,
      zip: formData?.Zip,
      address_en: formData?.IAD,
    });
    const list = data?.importers?.map((item: any) => ({
      ...item,
      ImpCode: item?.imp_code,
      ImpName: item?.company_name_en,
      Tel: item?.phone?.split('-')?.join(''),
      Zip: item?.zip,
      IAD: item?.address_en,
      Add1: item?.add1,
      Add2: item?.add2,
      Add3: item?.add3,
      Add4: item?.add4,
    }));
    return {
      total: data?.totalCount,
      list,
    };
  };
  const { tableProps, search } = useAntdTable(getTableData, { form, manual: true });

  useEffect(() => {
    let channel = new window.BroadcastChannel('sk_focus');
    channel.onmessage = (e) => {
      e.data?.modal === 'search' && setVisible(true);
    };
    channel.onmessageerror = (ev) => {
      throw new Error('BroadcastChannel Error while deserializing: ' + ev.origin);
    };
    return () => channel?.close();
  }, []);

  useKeyPress('1', () => {
    visible && setChangeType(1);
  });
  useKeyPress('2', () => {
    visible && setChangeType(2);
  });
  useKeyPress('3', () => {
    visible && setChangeType(3);
  });
  useKeyPress('esc', () => {
    visible && handleCancel();
  });
  useKeyPress('F9', () => {
    visible && handleOK();
  });

  function handleOK() {
    if (selectedRows.length > 0) {
      const { ImpCode, ImpName, Tel, Zip, IAD, Add1, Add2, Add3, Add4 } = selectedRows[0];
      if (changeType === 1) {
        props?.form.setFieldsValue({ ImpCode, ImpName });
      } else if (changeType === 2) {
        props?.form.setFieldsValue({ Tel, Zip, IAD, Add1, Add2, Add3, Add4 });
      } else {
        props?.form.setFieldsValue({ ImpCode, ImpName, Tel, Zip, IAD, Add1, Add2, Add3, Add4 });
      }
      setVisible(false);
    }
  }
  function handleCancel() {
    setVisible(false);
  }

  function changeTarget(values: any[]) {
    if (values.includes(changeType)) {
      return { background: '#1890ff', color: '#fff' };
    }
    return {};
  }

  const rowSelection: TableRowSelection<API.Importer> = {
    type: 'radio',
    onChange: (_: any, selectedRows: API.Importer[]) => {
      setSelectedRows(selectedRows);
    },
  };

  return (
    <Modal
      destroyOnClose
      width={1260}
      title="輸入者情報"
      visible={visible}
      onCancel={handleCancel}
      footer={
        <Space>
          <Space>
            <span>変更項目選択：</span>
            <Radio.Group
              size="middle"
              value={changeType}
              onChange={(e) => setChangeType(e.target.value)}
            >
              <Radio value={1}>1: 輸入者コード + 輸入者名</Radio>
              <Radio value={2}>2: Tel + Zip + IAD</Radio>
              <Radio value={3}>3: ALL</Radio>
            </Radio.Group>
          </Space>
          <Space>
            <Button size="middle" onClick={handleCancel}>
              Cancel（ESC）
            </Button>
            <Button size="middle" type="primary" onClick={handleOK}>
              Accept（F9）
            </Button>
          </Space>
        </Space>
      }
    >
      <Space direction="vertical">
        <Form layout="inline" form={form} onFinish={search?.submit}>
          <Form.Item name="ImpCode">
            <Input placeholder="輸入者コード" style={{ width: 160 }} />
          </Form.Item>
          <Form.Item name="ImpName">
            <Input placeholder="輸入者名" style={{ width: 200 }} autoFocus />
          </Form.Item>
          <Form.Item name="Tel">
            <Input placeholder="電話番号" style={{ width: 140 }} />
          </Form.Item>
          <Form.Item name="Zip">
            <Input placeholder="郵便番号" style={{ width: 100 }} />
          </Form.Item>
          <Form.Item name="IAD">
            <Input placeholder="住所" style={{ width: 300 }} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={search.submit}>
              検索
            </Button>
            <Button onClick={search.reset} style={{ marginLeft: 16 }}>
              リセット
            </Button>
          </Form.Item>
        </Form>
        <Space align="start">
          <Descriptions size="small" title="現在のデータ" column={1}>
            {changeType !== 2 && (
              <Descriptions.Item label="9.輸入者コード">
                {props?.form?.getFieldValue('ImpCode')}
              </Descriptions.Item>
            )}
            {changeType !== 2 && (
              <Descriptions.Item label="10.輸入者名">
                {props?.form?.getFieldValue('ImpName')}
              </Descriptions.Item>
            )}
            {changeType !== 1 && (
              <Descriptions.Item label="16.電話番号">
                {props?.form?.getFieldValue('Tel')}
              </Descriptions.Item>
            )}
            {changeType !== 1 && (
              <Descriptions.Item label="11.郵便番号">
                {props?.form?.getFieldValue('Zip')}
              </Descriptions.Item>
            )}
            {changeType !== 1 && (
              <Descriptions.Item label="17.住所">
                {props?.form?.getFieldValue('IAD')}
              </Descriptions.Item>
            )}
          </Descriptions>
          {selectedRows?.length > 0 && (
            <Descriptions size="small" title="修正のデータ" column={1}>
              {changeType !== 2 && (
                <Descriptions.Item label="9.輸入者コード">
                  {selectedRows[0].ImpCode}
                </Descriptions.Item>
              )}
              {changeType !== 2 && (
                <Descriptions.Item label="10.輸入者名">{selectedRows[0].ImpName}</Descriptions.Item>
              )}
              {changeType !== 1 && (
                <Descriptions.Item label="16.電話番号">{selectedRows[0].Tel}</Descriptions.Item>
              )}
              {changeType !== 1 && (
                <Descriptions.Item label="11.郵便番号">{selectedRows[0].Zip}</Descriptions.Item>
              )}
              {changeType !== 1 && (
                <Descriptions.Item label="17.住所">{selectedRows[0].IAD}</Descriptions.Item>
              )}
            </Descriptions>
          )}
        </Space>
        <Table
          style={{ width: 1200 }}
          rowKey="_id"
          rowSelection={rowSelection}
          {...tableProps}
          scroll={{ y: 300 }}
        >
          <Table.Column width={140} title="輸入者コード" dataIndex="ImpCode" />
          <Table.Column width={120} title="輸入者名" dataIndex="ImpName" />
          <Table.Column width={100} title="電話番号" dataIndex="Tel" />
          <Table.Column width={100} title="郵便番号" dataIndex="Zip" />
          <Table.Column width={200} title="住所" dataIndex="IAD" />
        </Table>
      </Space>
    </Modal>
  );
};

export default SearchModal;
