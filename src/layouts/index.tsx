import React, { useState } from 'react';
import { Layout, Menu, Row, Col, Button } from 'antd';
import {
  CloudFilled,
  ProfileOutlined,
  UserOutlined,
  SettingOutlined,
  MenuUnfoldOutlined,
  SendOutlined,
  MenuFoldOutlined,
} from '@ant-design/icons';
import { useHistory, Link, setLocale } from 'umi';
////
import { useIntlFormat } from '../services/useIntl';
import styles from './index.less';

const Index: React.FC = (props) => {
  const history = useHistory();
  const isFull = ['/login', '/check'].some((item: any) =>
    history?.location?.pathname?.startsWith(item),
  );
  const [collapsed, setCollapsed] = useState(false);
  const toggle = () => {
    setCollapsed(!collapsed);
  };

  const [intlMenu] = useIntlFormat('menu');
  return isFull ? (
    <>{props?.children}</>
  ) : (
    <Layout className={styles['layout']}>
      <Layout.Sider
        className={styles['slider-layout']}
        trigger={null}
        collapsible
        collapsed={collapsed}
      >
        <div className={styles['logo']}>
          <CloudFilled className={styles['icon']} />
          {!collapsed && <span className={styles['text']}>シルケン</span>}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[history?.location?.pathname]}
        >
          <Menu.ItemGroup key="1" title={intlMenu('waybill.cn-to-jp')}>
            <Menu.SubMenu
              key="/cn-to-jp/cts"
              icon={<ProfileOutlined />}
              title={intlMenu('cts')}
            >
              <Menu.Item key="/cn-to-jp/cts/dashboard">
                <Link to="/cn-to-jp/cts/dashboard">Status Inquiry</Link>
              </Menu.Item>
              <Menu.Item key="/cn-to-jp/cts/large">
                <Link to="/cn-to-jp/cts/large">Large</Link>
              </Menu.Item>
              <Menu.Item key="/cn-to-jp/cts/small">
                <Link to="/cn-to-jp/cts/small">Small</Link>
              </Menu.Item>
              <Menu.Item key="/cn-to-jp/cts/manifest">
                <Link to="/cn-to-jp/cts/manifest">Manifest</Link>
              </Menu.Item>
              <Menu.Item key="/cn-to-jp/cts/other">
                <Link to="/cn-to-jp/cts/other">Other</Link>
              </Menu.Item>
            </Menu.SubMenu>

            <Menu.SubMenu
              key="/cn-to-jp/delivery"
              icon={<ProfileOutlined />}
              title={intlMenu('delivery')}
            >
              <Menu.Item key="/cn-to-jp/delivery/self">
                <Link to="/cn-to-jp/delivery/self">
                  {intlMenu('delivery.self')}
                </Link>
              </Menu.Item>
              <Menu.Item key="/cn-to-jp/delivery/other">
                <Link to="/cn-to-jp/delivery/other">
                  {intlMenu('delivery.other')}
                </Link>
              </Menu.Item>
            </Menu.SubMenu>
            <Menu.SubMenu
              key="/cn-to-jp/CSManagement"
              icon={<ProfileOutlined />}
              title={intlMenu('CSManagement')}
            >
              <Menu.Item key="/cn-to-jp/CSManagement/permit">
                <Link to="/cn-to-jp/CSManagement/permit">
                  {intlMenu('CSManagement.permit')}
                </Link>
              </Menu.Item>
              <Menu.Item key="/cn-to-jp/CSManagement/cargoIssues">
                <Link to="/cn-to-jp/CSManagement/cargoIssues">
                  {intlMenu('CSManagement.cargoIssues')}
                </Link>
              </Menu.Item>
            </Menu.SubMenu>
          </Menu.ItemGroup>

          <Menu.ItemGroup key="2" title={intlMenu('waybill.jp-to-cn')}>
            <Menu.SubMenu
              key="/jp-to-cn/waybill"
              icon={<ProfileOutlined />}
              title={intlMenu('waybill')}
            >
              <Menu.Item key="/jp-to-cn/waybill/BtoB">
                <Link to="/jp-to-cn/waybill/BtoB">
                  {intlMenu('waybill.BtoB')}
                </Link>
              </Menu.Item>
            </Menu.SubMenu>
          </Menu.ItemGroup>

          <Menu.ItemGroup key="/setting" title={intlMenu('setting')}>
            <Menu.Item key="/setting/driver" icon={<UserOutlined />}>
              <Link to="/setting/driver">{intlMenu('setting.driver')}</Link>
            </Menu.Item>
            <Menu.Item key="/setting/flight" icon={<SendOutlined />}>
              <Link to="/setting/flight">{intlMenu('setting.flight')}</Link>
            </Menu.Item>
            <Menu.Item key="/setting/zip-area" icon={<SettingOutlined />}>
              <Link to="/setting/zip-area">{intlMenu('setting.zipArea')}</Link>
            </Menu.Item>
          </Menu.ItemGroup>
        </Menu>
      </Layout.Sider>
      <Layout className={styles['site-layout']}>
        <Layout.Header className={styles['site-layout-background']}>
          <Row align="middle" justify="space-between">
            <Col>
              {React.createElement(
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
            </Col>
          </Row>
        </Layout.Header>
        <Layout.Content>{props?.children}</Layout.Content>
      </Layout>
    </Layout>
  );
};
export default Index;
