import { useEffect } from 'react';
import { Modal, Form, Input, Card, Row, Col, DatePicker, Select } from 'antd';
////
import { useAgentOptions } from '@/services/useAPIOption';
import { useSKForm } from '@silken-houtai/core/lib/useHooks';
import { dayLocal } from '@/utils/helper/day';

const formItemLayout = {
  labelCol: { span: 9 },
  wrapperCol: { span: 12 },
};

const formRowItemLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 20 },
};

const formHalfItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

const shadowStyle: React.CSSProperties = {
  WebkitBoxShadow: '0px 2px 12px 0px rgba(0,0,0,.1)',
  boxShadow: '0px 2px 12px 0px rgba(0,0,0,.1)',
  marginBottom: 20,
};

interface DataSource extends API.Issue {}

export interface WarehouseIssuesFormProps
  extends useSKForm.SKFormProps<DataSource> {}

const WarehouseIssuesForm: React.FC<WarehouseIssuesFormProps> = (props) => {
  const { agentOptions } = useAgentOptions();
  const { modalProps, formProps } = useSKForm.useFormBasic(props);

  useEffect(() => {
    if (props?.visible) {
      formProps?.form?.setFieldsValue({
        // -----------自社填写内容-------------
        waybill: props?.dataSource?.waybill || {},
        price_projects: props?.dataSource?.price_projects || [],
        created_user: props?.dataSource?.created_user || '',
        updated_user: props?.dataSource?.updated_user || '',
        createdAt: dayLocal(props?.dataSource?.createdAt || ''),
        updatedAt: dayLocal(props?.dataSource?.updatedAt || ''),
        issue_category: props?.dataSource?.issue_category || '',
        issue_detail: props?.dataSource?.issue_detail || '',
        status: props?.dataSource?.status || '',
        cargo_status: props?.dataSource?.cargo_status || '',
        // -----------代理店填写内容-------------
        reply_subject: props?.dataSource?.reply_subject || '',
        reply_date: dayLocal(props?.dataSource?.reply_date || ''),
        reply_content: props?.dataSource?.reply_content || '',
        receiver_name: props?.dataSource?.receiver_name || '',
        receiver_tel: props?.dataSource?.receiver_tel || '',
        receiver_zip: props?.dataSource?.receiver_zip || '',
        receiver_add: props?.dataSource?.receiver_add || '',
        CMN: props?.dataSource?.CMN || '',
        // -----------自社填写内容-------------
        send_date: dayLocal(props?.dataSource?.send_date || ''),
        new_tracking_no: props?.dataSource?.new_tracking_no || '',
        solve_method: props?.dataSource?.solve_method || '',
        solve_date: dayLocal(props?.dataSource?.solve_date || ''),
        solve_note: props?.dataSource?.solve_note || '',
      });
    }
  }, [props]);

  return (
    <Modal {...modalProps} width={1200} style={{ marginTop: '15vh' }}>
      <Form name="WarehouseIssuesForm" {...formItemLayout} {...formProps}>
        <Card title="S.C.LOGISTICS" style={shadowStyle}>
          <Row>
            <Col span={8}>
              <Form.Item label="MASTER番号" name={['waybill', 'MAB']}>
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="HOUSE番号" name={['waybill', 'HAB']}>
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="登録者" name={['created_user', 'name']}>
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="伝票番号" name={['waybill', 'HAB']}>
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="代理店" name={['waybill', 'agent']}>
                <Select allowClear disabled options={agentOptions} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="連絡日" name="createdAt">
                <DatePicker />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="問題該当"
                name="issue_category"
                rules={[{ required: true }]}
              >
                <Select
                  allowClear
                  placeholder="問題該当"
                  options={[
                    { label: '破損', value: '破損' },
                    { label: '搬入時破損', value: '搬入時破損' },
                    { label: '住所不明', value: '住所不明' },
                    { label: '受取辞退', value: '受取辞退' },
                    { label: 'ラベル剥がれ', value: 'ラベル剥がれ' },
                    { label: '長期不在', value: '長期不在' },
                    { label: '住所変更', value: '住所変更' },
                    { label: '滅却', value: '滅却' },
                    { label: '代替品', value: '代替品' },
                    { label: '紛失', value: '紛失' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="返品状態"
                name="cargo_status"
                rules={[{ required: true }]}
              >
                <Select
                  allowClear
                  placeholder="返品状態"
                  options={[
                    { label: '返品済', value: '返品済' },
                    { label: '未', value: '未' },
                    { label: '搬入時', value: '搬入時' },
                    { label: '滅却', value: '滅却' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="状態" name="status">
                <Select
                  allowClear
                  placeholder="状態"
                  options={[
                    { label: '未処理', value: '未処理' },
                    { label: '問題作成', value: '問題作成' },
                    { label: '代理店対応中', value: '代理店対応中' },
                    { label: 'CS対応中', value: 'CS対応中' },
                    { label: '対応完了', value: '対応完了' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label="問題詳細"
                name="issue_detail"
                {...formRowItemLayout}
              >
                <Input.TextArea rows={7} />
              </Form.Item>
            </Col>
          </Row>
        </Card>
        <Card title="Forwarder" style={shadowStyle}>
          <Row>
            <Col span={8}>
              <Form.Item label="科目" name="reply_subject" required>
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="回答日" name="reply_date" required>
                <DatePicker disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="通知者" name={['agent', 'name']}>
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label="内容"
                name="reply_content"
                {...formRowItemLayout}
              >
                <Input.TextArea rows={7} disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="受取人" name="receiver_name">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="受取人電話番号" name="receiver_tel">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="受取人郵便番号" name="receiver_zip">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label="受取人住所"
                name="receiver_add"
                {...formRowItemLayout}
              >
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label="品名"
                name="CMN"
                {...formRowItemLayout}
                required
              >
                <Input disabled />
              </Form.Item>
            </Col>
          </Row>
        </Card>
        <Card title="S.C.LOGISTICS" style={shadowStyle}>
          <Row>
            <Col span={8}>
              <Form.Item label="発送日" name="send_date">
                <DatePicker />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="新伝票番号" name="new_tracking_no">
                <Input />
              </Form.Item>
            </Col>
            <Col span={8} />
            <Col span={8}>
              <Form.Item label="対応方法" name="solve_method">
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="処理日" name="solve_date">
                <DatePicker />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="料金項目" {...formRowItemLayout}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="料金項目1"
                name={['price_projects', 0, 'name']}
                {...formHalfItemLayout}
              >
                <Select
                  allowClear
                  options={[
                    { label: '滅却費用', value: '滅却費用' },
                    { label: '貨物点検', value: '貨物点検' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="料金1"
                name={['price_projects', 0, 'price']}
                {...formHalfItemLayout}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="料金項目2"
                name={['price_projects', 1, 'name']}
                {...formHalfItemLayout}
              >
                <Select
                  allowClear
                  options={[
                    { label: '滅却費用', value: '滅却費用' },
                    { label: '貨物点検', value: '貨物点検' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="料金2"
                name={['price_projects', 1, 'price']}
                {...formHalfItemLayout}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="料金項目3"
                name={['price_projects', 2, 'name']}
                {...formHalfItemLayout}
              >
                <Select
                  allowClear
                  options={[
                    { label: '滅却費用', value: '滅却費用' },
                    { label: '貨物点検', value: '貨物点検' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="料金3"
                name={['price_projects', 2, 'price']}
                {...formHalfItemLayout}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="料金項目4"
                name={['price_projects', 3, 'name']}
                {...formHalfItemLayout}
              >
                <Select
                  allowClear
                  options={[
                    { label: '滅却費用', value: '滅却費用' },
                    { label: '貨物点検', value: '貨物点検' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="料金4"
                name={['price_projects', 3, 'price']}
                {...formHalfItemLayout}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="料金項目5"
                name={['price_projects', 4, 'name']}
                {...formHalfItemLayout}
              >
                <Select
                  allowClear
                  options={[
                    { label: '滅却費用', value: '滅却費用' },
                    { label: '貨物点検', value: '貨物点検' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="料金5"
                name={['price_projects', 4, 'price']}
                {...formHalfItemLayout}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="備考" name="solve_note" {...formRowItemLayout}>
                <Input.TextArea rows={7} />
              </Form.Item>
            </Col>
          </Row>
        </Card>
      </Form>
    </Modal>
  );
};

export default WarehouseIssuesForm;
