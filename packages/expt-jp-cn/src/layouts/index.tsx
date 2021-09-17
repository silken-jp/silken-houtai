import React, { useState } from 'react';
import { Layout, Menu, Row, Col, Button } from 'antd';
import { CloudFilled, ProfileOutlined, MenuUnfoldOutlined, SendOutlined, MenuFoldOutlined } from '@ant-design/icons';
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
          {!collapsed && <span className={styles['text']}>シルケン日中</span>}
        </div>
        <Menu theme="dark" mode="inline" selectedKeys={[history?.location?.pathname]}>
          <Menu.ItemGroup key="2" title={intlMenu('waybill')}>
            <Menu.SubMenu key="/waybill" icon={<ProfileOutlined />} title={intlMenu('waybill')}>
              <Menu.Item key="/waybill/BtoB">
                <Link to="/waybill/BtoB">{intlMenu('waybill.BtoB')}</Link>
              </Menu.Item>
            </Menu.SubMenu>
          </Menu.ItemGroup>

          <Menu.ItemGroup key="/setting" title={intlMenu('setting')}>
            <Menu.Item key="/setting/flight" icon={<SendOutlined />}>
              <Link to="/setting/flight">{intlMenu('setting.flight')}</Link>
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
