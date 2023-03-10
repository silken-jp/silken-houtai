/**
 * title: 登陆
 */
import { useState, Fragment } from 'react';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { Form, Input, Button, message } from 'antd';
////
import { userSingIn } from '@/services/request/user';
import { setUserInfo } from '@/services/useStorage';
import styles from './login.less';

const LoginForm: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      const { password, ...res } = await userSingIn({ ...values });
      const remainingMilliseconds = 24 * 60 * 60 * 1000;
      const expiryDate = new Date(new Date().getTime() + remainingMilliseconds);
      setUserInfo({ ...res, expiryDate });
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
          <div className={styles.title}>物流管理系统</div>
          <div className={styles.subtitle}>后台管理</div>
          <Form.Item
            name="email"
            rules={[{ required: true, message: <Fragment /> }]}
            className={styles.FormItem}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="メール"
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
              placeholder="パスワード"
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
              登录
            </Button>
          </Form.Item>
        </div>
      </Form>
    </div>
  );
};

export default LoginForm;
