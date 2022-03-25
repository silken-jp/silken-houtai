/**
 * title: 登陆
 */
import { useState, Fragment } from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Form, Input, Button, message } from 'antd';
////
import { setAgentInfo } from '@/services/useStorage';
import { agentSingIn } from '@/services/request/agent';
import styles from './login.less';

const LoginForm: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      const { password, ...data } = await agentSingIn({ ...values });
      const remainingMilliseconds = 24 * 60 * 60 * 1000;
      const expiryDate = new Date(new Date().getTime() + remainingMilliseconds);
      setAgentInfo({ ...data, expiryDate });
      setLoading(false);
      window.location.reload();
    } catch (error: any) {
      message.error(error?.data?.message);
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginLayout}>
      <Form form={form} onFinish={onFinish} className={styles.form}>
        <div className={styles.login}>
          <div className={styles.title}>S.C.LOGISTICS</div>
          <div className={styles.subtitle}>フォワーダーシステム</div>
          <Form.Item
            name="account"
            rules={[{ required: true, message: <Fragment /> }]}
            className={styles.FormItem}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="account"
              className={styles.input}
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: <Fragment /> }]}
            className={styles.FormItem}
          >
            <Input.Password
              prefix={<LockOutlined />}
              type="password"
              placeholder="password"
              className={styles.input}
            />
          </Form.Item>
          <br />
          <Form.Item className={styles.FormItem}>
            <Button
              loading={loading}
              htmlType="submit"
              type="primary"
              block={true}
              className={styles.submit}
            >
              ログイン
            </Button>
          </Form.Item>
        </div>
      </Form>
    </div>
  );
};

export default LoginForm;
