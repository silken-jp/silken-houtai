import { useState, createElement } from 'react';
import { Layout, Menu, Row, Col, Button } from 'antd';
import {
  FormOutlined,
  SettingOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  GlobalOutlined,
  UserOutlined,
  CarOutlined,
} from '@ant-design/icons';
import { useHistory, Link, setLocale } from 'umi';
////
import { utils } from '@silken-houtai/core';
import { useIntlFormat } from '../services/useIntl';
import { removeUserInfo } from '@/services/useStorage';
import styles from './index.less';

const Index: React.FC = (props) => {
  const history = useHistory();
  const isFull = ['/login', '/cts/check/'].some((item: any) =>
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
              key: '/agent',
              icon: <GlobalOutlined />,
              label: <Link to="/agent">フォワーダー管理</Link>,
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
            {
              key: '/cts',
              icon: <FormOutlined />,
              label: intlMenu('cts'),
              children: [
                {
                  key: '/cts/dashboard',
                  label: <Link to="/cts/dashboard">Dashboard</Link>,
                },
                {
                  key: '/cts/StatusInquiry',
                  label: <Link to="/cts/StatusInquiry">Status Inquiry</Link>,
                },
                {
                  key: '/cts/large',
                  label: <Link to="/cts/large">IDA-Large</Link>,
                },
                {
                  key: '/cts/small',
                  label: <Link to="/cts/small">IDA-Small</Link>,
                },
                {
                  key: '/cts/manifest',
                  label: <Link to="/cts/manifest">MIC</Link>,
                },
                {
                  key: '/cts/settings',
                  icon: <SettingOutlined />,
                  label: intlMenu('cts.settings'),
                  children: [
                    {
                      key: '/cts/settings/Currency',
                      label: (
                        <Link to="/cts/settings/Currency">為替レート管理</Link>
                      ),
                    },
                    {
                      key: '/cts/settings/Importer',
                      label: (
                        <Link to="/cts/settings/Importer">法人輸入者管理</Link>
                      ),
                    },
                    {
                      key: '/cts/settings/MICkey',
                      label: (
                        <Link to="/cts/settings/MICkey">フォルダ変更管理</Link>
                      ),
                    },
                    {
                      key: '/cts/settings/BlackList',
                      label: (
                        <Link to="/cts/settings/BlackList">
                          ブラックリスト管理
                        </Link>
                      ),
                    },
                  ],
                },
              ],
            },
            {
              key: '/delivery',
              icon: <CarOutlined />,
              label: intlMenu('delivery'),
              children: [
                {
                  key: '/delivery/self',
                  label: (
                    <Link to="/delivery/self">{intlMenu('delivery.self')}</Link>
                  ),
                },
                {
                  key: '/delivery/other',
                  label: (
                    <Link to="/delivery/other">
                      {intlMenu('delivery.other')}
                    </Link>
                  ),
                },
                {
                  key: '/delivery/settings',
                  icon: <SettingOutlined />,
                  label: intlMenu('cts.settings'),
                  children: [
                    {
                      key: '/delivery/settings/driver',
                      label: (
                        <Link to="/delivery/settings/driver">
                          {intlMenu('setting.driver')}
                        </Link>
                      ),
                    },
                    {
                      key: '/delivery/settings/zip-area',
                      label: (
                        <Link to="/delivery/settings/zip-area">
                          {intlMenu('setting.zipArea')}
                        </Link>
                      ),
                    },
                  ],
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
