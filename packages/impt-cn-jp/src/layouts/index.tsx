import React, { useState } from 'react';
import { Layout, Menu, Row, Col, Button } from 'antd';
import {
  CloudFilled,
  ProfileOutlined,
  UserOutlined,
  SettingOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from '@ant-design/icons';
import { useHistory, Link, setLocale } from 'umi';
////
import { useIntlFormat } from '../services/useIntl';
import styles from './index.less';

const Index: React.FC = (props) => {
  const history = useHistory();
  const isFull = ['/login', '/check'].some((item: any) => history?.location?.pathname?.startsWith(item));
  const [collapsed, setCollapsed] = useState(false);
  const toggle = () => {
    setCollapsed(!collapsed);
  };

  const [intlMenu] = useIntlFormat('menu');
  return isFull ? (
    <>{props?.children}</>
  ) : (
    <Layout className={styles['layout']}>
      <Layout.Sider className={styles['slider-layout']} trigger={null} collapsible collapsed={collapsed}>
        <div className={styles['logo']}>
          <CloudFilled className={styles['icon']} />
          {!collapsed && <span className={styles['text']}>シルケン</span>}
        </div>
        <Menu theme="dark" mode="inline" selectedKeys={[history?.location?.pathname]}>
          <Menu.ItemGroup key="1" title={intlMenu('waybill')}>
            <Menu.SubMenu key="/waybill/cts" icon={<ProfileOutlined />} title={intlMenu('cts')}>
              <Menu.Item key="/waybill/cts/dashboard">
                <Link to="/waybill/cts/dashboard">Status Inquiry</Link>
              </Menu.Item>
              <Menu.Item key="/waybill/cts/large">
                <Link to="/waybill/cts/large">Large</Link>
              </Menu.Item>
              <Menu.Item key="/waybill/cts/small">
                <Link to="/waybill/cts/small">Small</Link>
              </Menu.Item>
              <Menu.Item key="/waybill/cts/manifest">
                <Link to="/waybill/cts/manifest">Manifest</Link>
              </Menu.Item>
              <Menu.Item key="/waybill/cts/other">
                <Link to="/waybill/cts/other">Other</Link>
              </Menu.Item>
            </Menu.SubMenu>

            <Menu.SubMenu key="/waybill/delivery" icon={<ProfileOutlined />} title={intlMenu('delivery')}>
              <Menu.Item key="/waybill/delivery/self">
                <Link to="/waybill/delivery/self">{intlMenu('delivery.self')}</Link>
              </Menu.Item>
              <Menu.Item key="/waybill/delivery/other">
                <Link to="/waybill/delivery/other">{intlMenu('delivery.other')}</Link>
              </Menu.Item>
            </Menu.SubMenu>
            <Menu.SubMenu key="/waybill/CSManagement" icon={<ProfileOutlined />} title={intlMenu('CSManagement')}>
              <Menu.Item key="/waybill/CSManagement/permit">
                <Link to="/waybill/CSManagement/permit">{intlMenu('CSManagement.permit')}</Link>
              </Menu.Item>
              <Menu.Item key="/waybill/CSManagement/cargoIssues">
                <Link to="/waybill/CSManagement/cargoIssues">{intlMenu('CSManagement.cargoIssues')}</Link>
              </Menu.Item>
            </Menu.SubMenu>
          </Menu.ItemGroup>

          <Menu.ItemGroup key="/setting" title={intlMenu('setting')}>
            <Menu.Item key="/setting/driver" icon={<UserOutlined />}>
              <Link to="/setting/driver">{intlMenu('setting.driver')}</Link>
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
              {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                className: styles['trigger'],
                onClick: toggle,
              })}
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
