import { useState, createElement } from 'react';
import { Layout, Menu, Row, Col, Button } from 'antd';
import {
  CloudFilled,
  SendOutlined,
  ProfileOutlined,
  DashboardOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from '@ant-design/icons';
import { useHistory, Link, setLocale } from 'umi';
////
import { removeAgentInfo } from '@/services/useStorage';
import { useIntlFormat } from '../services/useIntl';
import styles from './index.less';

const Index: React.FC<{ children: any }> = (props) => {
  const history = useHistory();
  const isFull = ['/login', '/cts/check/', '/print'].some((item: any) =>
    history?.location?.pathname?.startsWith(item),
  );

  const [collapsed, setCollapsed] = useState(false);
  const toggle = () => {
    setCollapsed(!collapsed);
  };

  const [intlMenu] = useIntlFormat('menu');

  const handleLogOut = () => {
    removeAgentInfo();
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
          <CloudFilled className={styles['icon']} />
          {!collapsed && <span className={styles['text']}>S.C.LOGISTICS</span>}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[history?.location?.pathname]}
        >
          <Menu.Item key="/home" icon={<DashboardOutlined />}>
            <Link to="/home">{intlMenu('home')}</Link>
          </Menu.Item>
          <Menu.SubMenu
            key="/cts"
            icon={<ProfileOutlined />}
            title={intlMenu('cts')}
          >
            <Menu.Item key="/cts/StatusInquiry">
              <Link to="/cts/StatusInquiry">Status Inquiry</Link>
            </Menu.Item>
            {/* <Menu.SubMenu key="/cts/edi-print" title="送り状">
              <Menu.Item key="/cts/edi-print/sagawa">
                <Link to="/cts/edi-print/sagawa">佐川</Link>
              </Menu.Item>
            </Menu.SubMenu> */}
          </Menu.SubMenu>
          <Menu.SubMenu
            key="/CSManagement"
            icon={<SendOutlined />}
            title={intlMenu('CSManagement')}
          >
            <Menu.Item key="/CSManagement/permit">
              <Link to="/CSManagement/permit">
                {intlMenu('CSManagement.permit')}
              </Link>
            </Menu.Item>
            <Menu.Item key="/CSManagement/cargoIssues">
              <Link to="/CSManagement/cargoIssues">
                {intlMenu('CSManagement.cargoIssues')}
              </Link>
            </Menu.Item>
          </Menu.SubMenu>
        </Menu>
      </Layout.Sider>
      <Layout className={styles['site-layout']}>
        <Layout.Header className={styles['site-layout-background']}>
          <Row align="middle" justify="space-between">
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
              {/* <Button type="link" onClick={() => setLocale('zh-CN', false)}>
                中
              </Button> */}
              <Button type="link" onClick={() => setLocale('ja-JP', false)}>
                日
              </Button>
              <Button type="link" onClick={() => setLocale('en-US', false)}>
                EN
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
