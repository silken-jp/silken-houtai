import { useState, createElement } from 'react';
import { Layout, Menu, Row, Col, Button } from 'antd';
import {
  FormOutlined,
  SettingOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
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
        >
          <Menu.SubMenu
            key="/cts"
            icon={<FormOutlined />}
            title={intlMenu('cts')}
          >
            <Menu.Item key="/cts/dashboard">
              <Link to="/cts/dashboard">Dashboard</Link>
            </Menu.Item>
            <Menu.Item key="/cts/StatusInquiry">
              <Link to="/cts/StatusInquiry">Status Inquiry</Link>
            </Menu.Item>
            <Menu.SubMenu key="/cts/IDA" title={'IDA'}>
              <Menu.Item key="/cts/large">
                <Link to="/cts/large">Large</Link>
              </Menu.Item>
              <Menu.Item key="/cts/small">
                <Link to="/cts/small">Small</Link>
              </Menu.Item>
            </Menu.SubMenu>
            <Menu.Item key="/cts/manifest">
              <Link to="/cts/manifest">MIC</Link>
            </Menu.Item>

            <Menu.SubMenu
              key="/cts/settings"
              title={intlMenu('cts.settings')}
              icon={<SettingOutlined />}
            >
              <Menu.Item key="/cts/settings/Importer">
                <Link to="/cts/settings/Importer">法人輸入者管理</Link>
              </Menu.Item>
              <Menu.Item key="/cts/settings/MICkey">
                <Link to="/cts/settings/MICkey">
                  {intlMenu('setting.MICkey')}
                </Link>
              </Menu.Item>
              <Menu.Item key="/cts/settings/BlackList">
                <Link to="/cts/settings/BlackList">ブラックリスト管理</Link>
              </Menu.Item>
            </Menu.SubMenu>
          </Menu.SubMenu>

          <Menu.SubMenu
            key="/delivery"
            icon={<CarOutlined />}
            title={intlMenu('delivery')}
          >
            <Menu.Item key="/delivery/self">
              <Link to="/delivery/self">{intlMenu('delivery.self')}</Link>
            </Menu.Item>
            <Menu.Item key="/delivery/other">
              <Link to="/delivery/other">{intlMenu('delivery.other')}</Link>
            </Menu.Item>

            <Menu.SubMenu
              key="/delivery/settings"
              title={intlMenu('delivery.settings')}
              icon={<SettingOutlined />}
            >
              <Menu.Item key="/delivery/settings/driver">
                <Link to="/delivery/settings/driver">
                  {intlMenu('setting.driver')}
                </Link>
              </Menu.Item>
              <Menu.Item key="/delivery/settings/zip-area">
                <Link to="/delivery/settings/zip-area">
                  {intlMenu('setting.zipArea')}
                </Link>
              </Menu.Item>
            </Menu.SubMenu>
          </Menu.SubMenu>
        </Menu>
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
