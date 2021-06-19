import React, { useState } from 'react';
import { Avatar, Layout, Menu, Row, Col } from 'antd';
import {
  CloudFilled,
  DashboardOutlined,
  ProfileOutlined,
  UserOutlined,
  SettingOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from '@ant-design/icons';
import { useHistory, Link, useIntl } from 'umi';
////
import styles from './index.less';

const Index: React.FC = (props) => {
  const history = useHistory();
  const isFull = ['/login'].some((item: any) =>
    history?.location?.pathname?.startsWith(item),
  );
  const [collapsed, setCollapsed] = useState(false);
  const toggle = () => {
    setCollapsed(!collapsed);
  };

  const intl = useIntl();
  const routes = [
    // {
    //   path: '/dashboard',
    //   name: intl.formatMessage({ id: 'menu.dashboard' }),
    //   icon: <DashboardOutlined />,
    //   children: null,
    // },
    // {
    //   path: '/waybill',
    //   name: intl.formatMessage({ id: 'menu.waybill' }),
    //   icon: <ProfileOutlined />,
    //   children: [
    //     {
    //       path: '/waybill/small-packet',
    //       name: intl.formatMessage({ id: 'menu.waybill.smallPacket' }),
    //     },
    //     {
    //       path: '/waybill/biz-packet',
    //       name: intl.formatMessage({ id: 'menu.waybill.bizPacket' }),
    //     },
    //   ],
    // },
    {
      path: '/waybill',
      name: intl.formatMessage({ id: 'menu.waybill' }),
      icon: <ProfileOutlined />,
      children: null,
    },
    {
      path: '/driver',
      name: intl.formatMessage({ id: 'menu.driver' }),
      icon: <UserOutlined />,
      children: null,
    },
    {
      path: '/setting',
      name: intl.formatMessage({ id: 'menu.setting' }),
      icon: <SettingOutlined />,
      children: [
        {
          path: '/setting/flight',
          name: intl.formatMessage({ id: 'menu.setting.flight' }),
        },
        {
          path: '/setting/zip-area',
          name: intl.formatMessage({ id: 'menu.setting.zipArea' }),
        },
      ],
    },
  ];

  return isFull ? (
    <>{props?.children}</>
  ) : (
    <Layout className={styles['layout']}>
      <Layout.Sider trigger={null} collapsible collapsed={collapsed}>
        <div className={styles['logo']}>
          <CloudFilled className={styles['icon']} />
          {!collapsed && <span className={styles['text']}>シルケン</span>}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[history?.location?.pathname]}
        >
          {routes?.map((route: any) => {
            return !route?.children ? (
              <Menu.Item key={route?.path} icon={route?.icon}>
                <Link to={route?.path}>{route?.name}</Link>
              </Menu.Item>
            ) : (
              <Menu.SubMenu
                key={route?.path}
                icon={route?.icon}
                title={route?.name}
              >
                {route?.children?.map((item: any) => (
                  <Menu.Item key={item?.path}>
                    <Link to={item?.path}>{item?.name}</Link>
                  </Menu.Item>
                ))}
              </Menu.SubMenu>
            );
          })}
        </Menu>
      </Layout.Sider>
      <Layout className={styles['site-layout']}>
        <Layout.Header className={styles['site-layout-background']}>
          <Row align="middle" justify="space-between">
            <Col>
              {React.createElement(
                collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
                { className: styles['trigger'], onClick: toggle },
              )}
            </Col>
            <Col>{/* <Avatar /> */}</Col>
          </Row>
        </Layout.Header>
        <Layout.Content>{props?.children}</Layout.Content>
      </Layout>
    </Layout>
  );
};
export default Index;
