import { useState, createElement } from 'react';
import { Layout, Menu, Row, Col, Button } from 'antd';
import {
  CloudFilled,
  FormOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from '@ant-design/icons';
import { useHistory, Link, setLocale } from 'umi';
////
import { removeAgentInfo } from '@/services/useStorage';
// import { useIntlFormat } from '../services/useIntl';
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

  // const [intlMenu] = useIntlFormat('menu');

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
          <Menu.Item key="/home">
            <Link to="/home">ダッシュボード</Link>
          </Menu.Item>
          <Menu.SubMenu key="/cts" icon={<FormOutlined />} title="通関管理">
            <Menu.Item key="/cts/StatusInquiry">
              <Link to="/cts/StatusInquiry">Status Inquiry</Link>
            </Menu.Item>
          </Menu.SubMenu>
          <Menu.SubMenu
            key="/CSManagement"
            icon={<FormOutlined />}
            title="CS管理"
          >
            <Menu.Item key="/CSManagement/permit">
              <Link to="/CSManagement/permit">貨物状況確認</Link>
            </Menu.Item>
            <Menu.Item key="/CSManagement/cargoIssues">
              <Link to="/CSManagement/cargoIssues">貨物問題リスト</Link>
            </Menu.Item>
          </Menu.SubMenu>
          <Menu.SubMenu
            key="/delivery"
            icon={<FormOutlined />}
            title="配送管理"
          >
            <Menu.Item key="/delivery/self">
              <Link to="/delivery/self">自社配送状況確認</Link>
            </Menu.Item>
            <Menu.Item key="/delivery/other">
              <Link to="/delivery/other">他社配送状況確認</Link>
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
