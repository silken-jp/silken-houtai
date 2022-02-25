import { useState, createElement } from 'react';
import { Layout, Menu, Row, Col, Button } from 'antd';
import {
  CloudFilled,
  ProfileOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  SettingOutlined,
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
          {!collapsed && <span className={styles['text']}>S.C.LOGISTICS</span>}
        </div>
        <Menu theme="dark" mode="inline" selectedKeys={[history?.location?.pathname]}>
          <Menu.SubMenu key="/delivery" icon={<ProfileOutlined />} title={intlMenu('delivery')}>
            <Menu.Item key="/delivery/BtoB">
              <Link to="/delivery/BtoB">BtoB</Link>
            </Menu.Item>
            <Menu.SubMenu
              key="/delivery/settings"
              title={intlMenu('delivery.settings')}
              icon={<SettingOutlined />}
            >
              <Menu.Item key="/delivery/settings/flight">
                <Link to="/delivery/settings/flight">{intlMenu('setting.flight')}</Link>
              </Menu.Item>
            </Menu.SubMenu>
          </Menu.SubMenu>
        </Menu>
      </Layout.Sider>
      <Layout className={styles['site-layout']}>
        <Layout.Header className={styles['site-layout-background']}>
          <Row align="middle" justify="space-between">
            <Col>
              {createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
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
