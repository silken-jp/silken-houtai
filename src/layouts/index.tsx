import React from 'react';
import { Avatar } from 'antd';
import ProLayout from '@ant-design/pro-layout';
import {
  DashboardOutlined,
  ProfileOutlined,
  UserOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { useHistory, Link, useIntl } from 'umi';

const Index: React.FC = (props) => {
  const history = useHistory();
  const isFull = ['/login'].some((item: any) =>
    history?.location?.pathname?.startsWith(item),
  );

  const intl = useIntl();
  const defaultMenus = {
    routes: [
      {
        path: '/dashboard',
        name: intl.formatMessage({ id: 'menu.dashboard' }),
        icon: <DashboardOutlined />,
      },
      {
        path: '/waybill',
        name: intl.formatMessage({ id: 'menu.waybill' }),
        icon: <ProfileOutlined />,
        children: [
          {
            path: '/waybill/small-packet',
            name: intl.formatMessage({ id: 'menu.waybill.smallPacket' }),
          },
          {
            path: '/waybill/biz-packet',
            name: intl.formatMessage({ id: 'menu.waybill.bizPacket' }),
          },
        ],
      },
      {
        path: '/driver',
        name: intl.formatMessage({ id: 'menu.driver' }),
        icon: <UserOutlined />,
      },
      {
        path: '/setting',
        name: intl.formatMessage({ id: 'menu.setting' }),
        icon: <SettingOutlined />,
        children: [
          {
            path: '/setting/delivery-area',
            name: intl.formatMessage({ id: 'menu.setting.deliveryArea' }),
          },
        ],
      },
    ],
  };

  return isFull ? (
    <>{props?.children}</>
  ) : (
    <ProLayout
      style={{
        minHeight: '100vh',
      }}
      title="物流"
      location={history.location}
      fixSiderbar
      fixedHeader
      route={defaultMenus}
      menuItemRender={(item, dom) => {
        if (item.path && location.pathname !== item.path) {
          return <Link to={item.path}>{dom}</Link>;
        }
        return dom;
      }}
      rightContentRender={() => (
        <div>
          <Avatar icon={<UserOutlined />} />
        </div>
      )}
    >
      {props?.children}
    </ProLayout>
  );
};

export default Index;
