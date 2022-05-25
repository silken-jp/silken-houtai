import {
  Form,
  Menu,
  Layout,
  Input,
  Button,
  Card,
  message,
  Row,
  Col,
} from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { useRequest } from 'ahooks';
////
import { getCompany, updateCompany } from '@/services/request/company';

const { Header, Content, Footer, Sider } = Layout;

export interface companyProps {}

const inputs = [
  { label: '企業名', name: 'company_name' },
  { label: '企業名・英語', name: 'company_name_en' },
  { label: '本社住所', name: 'company_add' },
  { label: '本社住所・英語', name: 'company_add_en' },
  { label: '本社電話', name: 'company_tel' },
  { label: 'URL', name: 'url' },
  { label: '営業所名', name: 'office_name' },
  { label: '営業所名・英語', name: 'office_name_en' },
  { label: '営業所所在地', name: 'office_add' },
  { label: '営業所所在地・英語', name: 'office_add_en' },
  { label: '営業所郵便番号', name: 'office_zip' },
  { label: '営業所電話', name: 'office_tel' },
  { label: '営業所FAX', name: 'office_fax' },
  { label: '利用者コード', name: 'user_code' },
  { label: 'システム区分', name: 'system_category' },
  { label: '業種', name: 'industry_category' },
  { label: '通関業者コード', name: 'broker_code' },
  { label: '保税蔵置場コード', name: 'BW_code' },
  { label: '保税蔵置場住所', name: 'BW_add' },
  { label: '保税蔵置場住所・英語', name: 'BW_add_en' },
  { label: '保税蔵置場電話', name: 'BW_tel' },
];

const company: React.FC<companyProps> = () => {
  // state
  const [form] = Form.useForm();
  // api
  const { data = {}, error, loading } = useRequest(getCompany);
  // action
  async function handleSubmit() {
    try {
      const fields = await form.validateFields();
      await updateCompany({ companyId: data?._id, ...fields });
      message.success('submit success');
    } catch (error) {
      message.error('submit error');
    }
  }

  if (error) return <>error</>;

  return (
    <PageContainer loading={loading}>
      {/* <Layout style={{ padding: '24px 0', backgroundColor: '#FFF' }}>
        <Sider width={200}>
          <Menu
            mode="inline"
            defaultSelectedKeys={['0']}
            style={{ height: '100%' }}
            items={[
              {
                key: '0',
                label: '基本設定',
              },
            ]}
          />
        </Sider>
        <Content style={{ padding: '0 24px', minHeight: 280 }}> */}
      <Card
        title="基本設定"
        extra={
          <Button type="primary" loading={loading} onClick={handleSubmit}>
            保存
          </Button>
        }
      >
        <Form
          form={form}
          layout="vertical"
          name="companyForm"
          initialValues={{ ...data }}
        >
          <Row
            gutter={18}
            style={{
              marginBottom: 12,
              height: 'calc(100vh - 250px)',
              overflow: 'auto',
            }}
          >
            {inputs.map(({ label, name }) => (
              <Col key={name} span={12}>
                <Form.Item label={label} name={name}>
                  <Input />
                </Form.Item>
              </Col>
            ))}
          </Row>
        </Form>
      </Card>
      {/* </Content>
      </Layout> */}
    </PageContainer>
  );
};

export default company;
