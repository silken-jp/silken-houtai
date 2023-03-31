import { useEffect } from 'react';
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Radio,
  Space,
  Button,
  Select,
} from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
////
import { useSKForm } from '@silken-houtai/core/lib/useHooks';

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

const waybill_status: any = [
  { label: 'other', value: 0 },
  { label: 'normal', value: 1 },
  { label: 'hold', value: 2 },
  { label: 'sendBack', value: 3 },
];

export const SimpleManifestItems = [
  { no: 56, limit: 20, name: 'REF', holder: '社内整理用番号' },
  { no: 34, limit: 6, name: 'NO', holder: '貨物個数', ruleType: 'number' },
  { no: 35, limit: 8, name: 'GW', holder: '貨物重量', ruleType: 'number' },
  { no: 39, limit: 5, name: 'PSC', holder: '積出地コード' },
  { no: 38, limit: 3, name: 'DST', holder: '取卸港コード' },
  { no: 51, limit: 2, name: 'OR', holder: '原産地コード' },
  { no: 40, limit: 1, name: 'IP1', holder: 'インボイス価格区分コード' },
  { no: 41, limit: 3, name: 'IP2', holder: 'インボイス価格条件コード' },
  { no: 42, limit: 3, name: 'IP3', holder: 'インボイス通貨コード' },
  {
    no: 43,
    limit: 13,
    name: 'IP4',
    holder: 'インボイス価格',
    ruleType: 'number',
  },
  { no: 53, limit: 35, name: 'NT1', holder: '記事' },
  { no: 44, limit: 1, name: 'FR1', holder: '運賃区分コード' },
  { no: 45, limit: 3, name: 'FR2', holder: '運賃通貨コード' },
  { no: 46, limit: 11, name: 'FR3', holder: '運賃', ruleType: 'number' },
  { no: 47, limit: 1, name: 'IN1', holder: '保険区分コード' },
  { no: 48, limit: 3, name: 'IN2', holder: '保険通貨コード' },
  { no: 49, limit: 9, name: 'IN3', holder: '保険金額', ruleType: 'number' },
  {
    type: 'text',
    no: '10text',
    limit: 70,
    name: 'ImpNameJP',
    holder: '輸入者名',
  },
  { no: 10, limit: 70, name: 'ImpName', holder: '輸入者名' },
  { no: 9, limit: 17, name: 'ImpCode', holder: '輸入者コード' },
  { no: 16, limit: 11, name: 'Tel', holder: '輸入者電話番号' },
  { no: 11, limit: 7, name: 'Zip', holder: '郵便番号' },
  { type: 'text', no: 17, limit: 105, name: 'IADJP', holder: '輸入者住所' },
  { no: 12, limit: 15, name: 'Add1', holder: '住所１（都道府県）' },
  {
    no: 13,
    limit: 35,
    name: 'Add2',
    holder: '住所２（市区町村（行政区名））',
  },
  { no: 14, limit: 35, name: 'Add3', holder: '住所３（町域名・番地）' },
  { no: 15, limit: 70, name: 'Add4', holder: '住所４（ビル名ほか）' },
  { no: 24, limit: 70, name: 'EPN', holder: '仕出人名' },
  { no: 31, limit: 105, name: 'EAD', holder: '仕出人住所' },
  { no: 30, limit: 2, name: 'EPO', holder: '国名コード（Country,coded）' },
];

interface DataSource extends API.Waybill {}

export interface HAWBFormProps extends useSKForm.SKFormProps<DataSource> {}

const HAWBForm: React.FC<HAWBFormProps> = (props) => {
  const { modalProps, formProps } = useSKForm.useFormBasic(props);

  const LS = Form?.useWatch('LS', formProps.form);

  useEffect(() => {
    if (props?.visible) {
      formProps?.form?.setFieldsValue({
        ...props?.dataSource,
        HSRepeat: props?.dataSource?.HSRepeat || [],
      });
    }
  }, [props]);

  return (
    <Modal {...modalProps} width={1200}>
      <Form size="small" name="HAWBForm" {...formItemLayout} {...formProps}>
        <Form.Item
          label="waybill_status"
          name="waybill_status"
          rules={[{ required: true }]}
        >
          <Select placeholder="waybill_status" options={waybill_status} />
        </Form.Item>
        <Form.Item label="L・S・M識別" name="LS" rules={[{ required: true }]}>
          <Radio.Group
            onChange={(e) => {
              if (e?.target?.value === 'M') {
                formProps.form.setFieldValue('waybill_type', 'MIC');
              } else {
                formProps.form.setFieldValue('waybill_type', 'IDA');
              }
            }}
            options={[
              { value: 'L', label: 'Large' },
              { value: 'S', label: 'Small' },
              { value: 'M', label: 'MIC' },
            ]}
          />
        </Form.Item>
        <Form.Item
          label="業務コード"
          name="waybill_type"
          rules={[{ required: true }]}
        >
          <Input placeholder="業務コード" autoComplete="off" disabled />
        </Form.Item>
        <Form.Item label="HAWB番号" name="HAB" rules={[{ required: true }]}>
          <Input placeholder="HAWB番号" autoComplete="off" />
        </Form.Item>
        <Form.Item
          label="品名"
          name="CMN"
          rules={[{ required: true }, { max: 40 }]}
        >
          <Input placeholder="品名" autoComplete="off" />
        </Form.Item>
        <Form.Item label="値段" name="_NT1" rules={[{ required: true }]}>
          <InputNumber placeholder="値段" autoComplete="off" step={0.01} />
        </Form.Item>
        {LS !== 'M' && (
          <Form.Item label="繰返部" required>
            <Form.List name="HSRepeat">
              {(fields, { add, remove }) => (
                <>
                  {fields.map((field) => (
                    <Space key={field.key} align="baseline">
                      <Form.Item
                        {...field}
                        name={[field.name, 'CMN']}
                        rules={[{ required: true }]}
                      >
                        <Input placeholder="101.CMN:品名" />
                      </Form.Item>
                      <Form.Item
                        {...field}
                        name={[field.name, 'QN1']}
                        rules={[{ required: true }]}
                      >
                        <Input placeholder="104.QN1:数量" />
                      </Form.Item>
                      <Form.Item
                        {...field}
                        name={[field.name, 'DPR']}
                        rules={[{ required: true }]}
                      >
                        <Input placeholder="113.DPR:課税価格" />
                      </Form.Item>

                      <MinusCircleOutlined onClick={() => remove(field.name)} />
                    </Space>
                  ))}

                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                    >
                      繰返部追加
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Form.Item>
        )}
        {SimpleManifestItems?.map((item) => {
          return (
            <Form.Item
              key={item.no}
              label={`${item.no}.${item.name}.${item.holder}`}
              name={item.name}
            >
              <Input disabled={item.type === 'text'} />
            </Form.Item>
          );
        })}
      </Form>
    </Modal>
  );
};

export default HAWBForm;
