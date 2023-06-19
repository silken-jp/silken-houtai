import React, { useState, createElement } from 'react';
import { Layout, Menu, Row, Col, Button } from 'antd';
import {
  FormOutlined,
  SettingOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  GlobalOutlined,
  UserOutlined,
  CarOutlined,
  IssuesCloseOutlined,
} from '@ant-design/icons';
import { useHistory, Link, setLocale, Helmet } from 'umi';
////
import { utils } from '@silken-houtai/core';
import { useIntlFormat } from '../services/useIntl';
import { removeUserInfo } from '@/services/useStorage';
import styles from './index.less';

const Index: React.FC<{ children: any }> = (props) => {
  const history = useHistory();
  const isFull = ['/login', '/print', '/cts/check/'].some((item: any) =>
    history?.location?.pathname?.startsWith(item),
  );

  const [collapsed, setCollapsed] = useState(false);
  const toggle = () => {
    setCollapsed(!collapsed);
  };

  const [intlMenu] = useIntlFormat('menu');

  const handleLogOut = () => {
    removeUserInfo();
    window.location.reload();
  };

  return isFull ? (
    <>{props?.children}</>
  ) : (
    <Layout className={styles['layout']}>
      <Helmet>
        <title>Sclogi</title>
      </Helmet>
      <Layout.Sider
        className={styles['slider-layout']}
        width={260}
        trigger={null}
        collapsible
        collapsed={collapsed}
      >
        <div className={styles['logo']}>
          <img src={`${utils.ASSETS_URL}/images/logo.jpg`} height={32} />
          {!collapsed && <span className={styles['text']}>S.C.LOGISTICS</span>}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[history?.location?.pathname]}
          items={[
            {
              key: '/agent',
              icon: <GlobalOutlined />,
              label: 'フォワーダー管理',
              children: [
                {
                  key: '/agent/setting',
                  label: <Link to="/agent/setting">フォワーダーリスト</Link>,
                },
                {
                  key: '/agent/hawb-group',
                  label: <Link to="/agent/hawb-group">HAWB区間管理</Link>,
                },
                {
                  key: '/agent/hawb',
                  label: <Link to="/agent/hawb">HAWB配布</Link>,
                },
              ],
            },
            {
              key: '/billing',
              icon: <GlobalOutlined />,
              label: '請求管理',
              children: [
                {
                  key: '/billing/billing',
                  label: <Link to="/billing/billing">請求書リスト</Link>,
                },
                {
                  key: '/billing/mab',
                  label: <Link to="/billing/MAWB">MABリスト</Link>,
                },
              ],
            },
            {
              key: '/user',
              icon: <UserOutlined />,
              label: <Link to="/user">ユーザー管理</Link>,
            },
            {
              key: '/company',
              icon: <SettingOutlined />,
              label: <Link to="/company">会社設定</Link>,
            },
          ]}
        />
      </Layout.Sider>
      <Layout className={styles['site-layout']}>
        <Layout.Header className={styles['site-layout-background']}>
          <Row gutter={24} align="middle" justify="space-between">
            <Col>
              {createElement(
                collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
                {
                  className: styles['trigger'],
                  onClick: toggle,
                },
              )}
            </Col>
            <Col>
              <Button type="link" onClick={() => setLocale('zh-CN', false)}>
                中
              </Button>
              <Button type="link" onClick={() => setLocale('ja-JP', false)}>
                日
              </Button>
              <Button style={{ margin: '0 24px' }} onClick={handleLogOut}>
                {intlMenu('logout')}
              </Button>
            </Col>
          </Row>
        </Layout.Header>
        <Layout.Content>{props?.children}</Layout.Content>
      </Layout>
    </Layout>
  );
};
export default Index;
