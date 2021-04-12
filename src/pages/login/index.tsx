/**
 * title: 登陆
 */
import React, { useState } from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Form, Input, Button, message } from 'antd';

import { STORAGE_KEY } from '@/utils/const';
import styles from './login.less';

const LoginForm: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // const {
  //   userLogin: [, setUserLogin],
  // } = wxStorageState;

  const onFinish = async (values: any) => {
    try {
      await setLoading(true);
      // const { data } = await client.query({
      //   query: GQL.Auth.TEACHER_LOGIN,
      //   variables: values,
      // });
      const remainingMilliseconds = 24 * 60 * 60 * 1000;
      const expiryDate = new Date(new Date().getTime() + remainingMilliseconds);
      // setUserLogin({ ...data.TeacherLogin, expiryDate });
      localStorage.setItem(
        STORAGE_KEY + 'userLogin',
        JSON.stringify({ token: 'aaa', expiryDate }),
      );
      await setLoading(false);
      window.location.reload();
    } catch (error) {
      message.warning(error.message);
      await setLoading(false);
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
            rules={[{ required: true, message: <React.Fragment /> }]}
            className={styles.FormItem}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="账号"
              className={styles.input}
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: <React.Fragment /> }]}
            className={styles.FormItem}
          >
            <Input.Password
              prefix={<LockOutlined />}
              type="password"
              placeholder="密码"
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
