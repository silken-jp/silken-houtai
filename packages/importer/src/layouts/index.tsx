import React, { useState, createElement } from 'react';
import { Layout, Menu, Row, Col, Button } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { useHistory, Link, setLocale } from 'umi';
////
import { utils } from '@silken-houtai/core';
import { useIntlFormat } from '../services/useIntl';
import { removeUserInfo } from '@/services/useStorage';
import styles from './index.less';

const Index: React.FC<{ children: React.ReactNode }> = (props) => {
  const history = useHistory();
  const isFull = ['/login', '/print'].some((item: any) =>
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
          defaultOpenKeys={['/cts']}
          items={[
            {
              key: '/tools',
              label: <Link to="/tools">TOOLS</Link>,
            },
            {
              key: '/importer',
              label: <Link to="/importer">法人輸入者管理</Link>,
            },
            {
              key: '/edi-print',
              label: '送り状',
              children: [
                {
                  key: '/edi-print/sagawa',
                  label: <Link to="/edi-print/sagawa">佐川</Link>,
                },
              ],
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
                ログアウト
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
