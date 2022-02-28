import { useState, useEffect } from 'react';
import {
  Modal,
  Descriptions,
  Radio,
  Input,
  Space,
  Button,
  Table,
  Form,
  Row,
  Col,
} from 'antd';
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
  const [changeType, setChangeType] = useState<number>(3);
  const [selectedRows, setSelectedRows] = useState<API.Importer[]>([]);

  // query
  const getTableData = async (pageData: any, formData: any): Promise<any> => {
    const data = await getImporters({
      page: pageData?.current - 1,
      perPage: pageData?.pageSize,
      ...formData,
    });
    return {
      total: data?.totalCount,
      list: data?.importers,
    };
  };
  const { tableProps, search } = useAntdTable(getTableData, {
    form,
    manual: true,
  });

  useEffect(() => {
    let channel = new window.BroadcastChannel('sk_focus');
    channel.onmessage = (e) => {
      e.data?.modal === 'search' && setVisible(true);
    };
    channel.onmessageerror = (ev) => {
      throw new Error(
        'BroadcastChannel Error while deserializing: ' + ev.origin,
      );
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
    if (!changeType) {
      setVisible(false);
    } else if (selectedRows.length > 0) {
      const { ImpCode, ImpName, Tel, Zip, IAD, Add1, Add2, Add3, Add4 } =
        selectedRows[0];
      if (changeType === 1) {
        props?.form.setFieldsValue({ ImpCode, ImpName });
      } else if (changeType === 2) {
        props?.form.setFieldsValue({ Tel, Zip, IAD, Add1, Add2, Add3, Add4 });
      } else {
        props?.form.setFieldsValue({
          ImpCode,
          ImpName,
          Tel,
          Zip,
          IAD,
          Add1,
          Add2,
          Add3,
          Add4,
        });
      }
      setVisible(false);
    }
  }
  function handleCancel() {
    setVisible(false);
  }

  function renderChange(value: number, key: keyof API.Importer) {
    const isChangeTarget = changeType !== value;
    const style = isChangeTarget
      ? { textDecoration: 'line-through', color: '#9f9f9f' }
      : {};
    return (
      <Row>
        <Col span={11} style={style}>
          {props?.form?.getFieldValue(key)}
        </Col>
        {isChangeTarget && (
          <Col span={13}>
            {`\u2002\u2002\u2192\u2002\u2002`}
            {selectedRows?.[0]?.[key]}
          </Col>
        )}
      </Row>
    );
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
          <Button size="middle" onClick={handleCancel}>
            Cancel（ESC）
          </Button>
          <Button size="middle" type="primary" onClick={handleOK}>
            Accept（F9）
          </Button>
        </Space>
      }
    >
      <Space direction="vertical" style={{ width: '100%' }}>
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
            <Space>
              <Button type="primary" onClick={search.submit}>
                検索
              </Button>
              <Button onClick={search.reset}>リセット</Button>
            </Space>
          </Form.Item>
        </Form>
        <Descriptions
          size="small"
          column={1}
          bordered
          labelStyle={{ width: 160 }}
        >
          <Descriptions.Item>
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
          </Descriptions.Item>
          <Descriptions.Item label="09.輸入者コード">
            {renderChange(2, 'ImpCode')}
          </Descriptions.Item>
          <Descriptions.Item label="16.電話番号">
            {renderChange(1, 'Tel')}
          </Descriptions.Item>
          <Descriptions.Item label="11.郵便番号">
            {renderChange(1, 'Zip')}
          </Descriptions.Item>
          <Descriptions.Item label="10.輸入者名">
            {renderChange(2, 'ImpName')}
          </Descriptions.Item>
          <Descriptions.Item label="17.住所">
            {renderChange(1, 'IAD')}
          </Descriptions.Item>
        </Descriptions>
        <Table
          style={{ width: '100%' }}
          rowKey="_id"
          rowSelection={rowSelection}
          {...tableProps}
          scroll={{ x: 1200, y: 300 }}
        >
          <Table.Column width={150} title="法人番号" dataIndex="ImpCode" />
          <Table.Column width={250} title="輸入者名" dataIndex="ImpName" />
          <Table.Column width={150} title="電話番号" dataIndex="Tel" />
          <Table.Column width={100} title="郵便番号" dataIndex="Zip" />
          <Table.Column width={350} title="住所" dataIndex="IAD" />
        </Table>
      </Space>
    </Modal>
  );
};

export default SearchModal;
