import React, { useState, createElement } from 'react';
import { Layout, Menu, Row, Col, Button } from 'antd';
import {
  FormOutlined,
  SettingOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  GlobalOutlined,
  UserOutlined,
  CarOutlined,
  IssuesCloseOutlined,
} from '@ant-design/icons';
import { useHistory, Link, setLocale } from 'umi';
////
import { utils } from '@silken-houtai/core';
import { useIntlFormat } from '../services/useIntl';
import { removeUserInfo } from '@/services/useStorage';
import styles from './index.less';

const Index: React.FC<{ children: any }> = (props) => {
  const history = useHistory();
  const isFull = ['/login', '/print', '/cts/check/'].some((item: any) =>
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
          items={[
            {
              key: '/agent',
              icon: <GlobalOutlined />,
              label: 'フォワーダー管理',
              children: [
                {
                  key: '/agent/setting',
                  label: (
                    <Link target="_blank" to="/agent/setting">
                      フォワーダーリスト
                    </Link>
                  ),
                },
                {
                  key: '/agent/hawb-group',
                  label: (
                    <Link target="_blank" to="/agent/hawb-group">
                      HAWB区間管理
                    </Link>
                  ),
                },
                {
                  key: '/agent/hawb',
                  label: (
                    <Link target="_blank" to="/agent/hawb">
                      HAWB配布
                    </Link>
                  ),
                },
              ],
            },
            {
              key: '/user',
              icon: <UserOutlined />,
              label: (
                <Link target="_blank" to="/user">
                  ユーザー管理
                </Link>
              ),
            },
            {
              key: '/company',
              icon: <SettingOutlined />,
              label: (
                <Link target="_blank" to="/company">
                  会社設定
                </Link>
              ),
            },
            {
              key: '/cts',
              icon: <FormOutlined />,
              label: intlMenu('cts'),
              children: [
                {
                  key: '/cts/dashboard',
                  label: (
                    <Link target="_blank" to="/cts/dashboard">
                      Dashboard
                    </Link>
                  ),
                },
                {
                  key: '/cts/todo',
                  label: 'Todo',
                  children: [
                    {
                      key: '/cts/todo/today',
                      label: (
                        <Link target="_blank" to="/cts/todo/today">
                          Today
                        </Link>
                      ),
                    },
                    {
                      key: '/cts/todo/other',
                      label: (
                        <Link target="_blank" to="/cts/todo/other">
                          Other
                        </Link>
                      ),
                    },
                  ],
                },
                {
                  key: '/cts/StatusInquiry',
                  label: 'Status Inquiry',
                  children: [
                    {
                      key: '/cts/StatusInquiry/Simple',
                      label: (
                        <Link target="_blank" to="/cts/StatusInquiry/Simple">
                          Simple
                        </Link>
                      ),
                    },
                    {
                      key: '/cts/StatusInquiry/Full',
                      label: (
                        <Link target="_blank" to="/cts/StatusInquiry/Full">
                          Full
                        </Link>
                      ),
                    },
                    {
                      key: '/cts/StatusInquiry/HAWB',
                      label: (
                        <Link target="_blank" to="/cts/StatusInquiry/HAWB">
                          HAWB
                        </Link>
                      ),
                    },
                  ],
                },
                {
                  key: '/cts/large',
                  label: (
                    <Link target="_blank" to="/cts/large">
                      IDA-Large
                    </Link>
                  ),
                },
                {
                  key: '/cts/small',
                  label: (
                    <Link target="_blank" to="/cts/small">
                      IDA-Small
                    </Link>
                  ),
                },
                {
                  key: '/cts/manifest',
                  label: (
                    <Link target="_blank" to="/cts/manifest">
                      MIC
                    </Link>
                  ),
                },
                // {
                //   key: '/cts/mutiEdit',
                //   label: 'Muti Broker Check',
                //   children: [
                //     {
                //       key: '/cts/mutiEdit/Brok',
                //       label: <Link to="/cts/mutiEdit/Brok">Demo1</Link>,
                //     },
                //     {
                //       key: '/cts/mutiEdit/Brok2',
                //       label: <Link to="/cts/mutiEdit/Brok2">Demo2</Link>,
                //     },
                //   ],
                // },
                {
                  key: '/cts/settings',
                  icon: <SettingOutlined />,
                  label: intlMenu('cts.settings'),
                  children: [
                    {
                      key: '/cts/settings/CMN',
                      label: (
                        <Link target="_blank" to="/cts/settings/CMN">
                          品名管理
                        </Link>
                      ),
                    },
                    {
                      key: '/cts/settings/GW_FR3',
                      label: (
                        <Link target="_blank" to="/cts/settings/GW_FR3">
                          運賃管理
                        </Link>
                      ),
                    },
                    {
                      key: '/cts/settings/GW_IP4',
                      label: (
                        <Link target="_blank" to="/cts/settings/GW_IP4">
                          インボイス価格管理
                        </Link>
                      ),
                    },
                    {
                      key: '/cts/settings/Currency',
                      label: (
                        <Link target="_blank" to="/cts/settings/Currency">
                          為替レート管理
                        </Link>
                      ),
                    },
                    {
                      key: '/cts/settings/Importer',
                      label: (
                        <Link target="_blank" to="/cts/settings/Importer">
                          法人輸入者管理
                        </Link>
                      ),
                    },
                    {
                      key: '/cts/settings/MICkey',
                      label: (
                        <Link target="_blank" to="/cts/settings/MICkey">
                          フォルダ変更管理
                        </Link>
                      ),
                    },
                    {
                      key: '/cts/settings/BlackList',
                      label: (
                        <Link target="_blank" to="/cts/settings/BlackList">
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
                  key: '/delivery/todo',
                  label: 'Todo',
                  children: [
                    {
                      key: '/delivery/todo/check',
                      label: (
                        <Link target="_blank" to="/delivery/todo/check">
                          Check
                        </Link>
                      ),
                    },
                    {
                      key: '/delivery/todo/timeoutList',
                      label: (
                        <Link target="_blank" to="/delivery/todo/timeoutList">
                          Timeout List
                        </Link>
                      ),
                    },
                  ],
                },
                {
                  key: '/delivery/self',
                  label: (
                    <Link target="_blank" to="/delivery/self">
                      {intlMenu('delivery.self')}
                    </Link>
                  ),
                },
                {
                  key: '/delivery/other',
                  label: intlMenu('delivery.other'),
                  children: [
                    {
                      key: '/delivery/other/dashboard',
                      label: (
                        <Link target="_blank" to="/delivery/other/dashboard">
                          Dashboard
                        </Link>
                      ),
                    },
                    {
                      key: '/delivery/other/sagawa',
                      label: (
                        <Link target="_blank" to="/delivery/other/sagawa">
                          佐川
                        </Link>
                      ),
                    },
                  ],
                },
                {
                  key: '/delivery/edi',
                  label: 'EDI',
                  children: [
                    {
                      key: '/delivery/edi/sagawa',
                      label: (
                        <Link target="_blank" to="/delivery/edi/sagawa">
                          佐川
                        </Link>
                      ),
                    },
                    // {
                    //   key: '/delivery/edi/seino',
                    //   label: <Link target="_blank" to="/delivery/edi/seino">西濃</Link>,
                    // },
                  ],
                },
                {
                  key: '/delivery/edi-print',
                  label: '送り状',
                  children: [
                    {
                      key: '/delivery/edi-print/sagawa',
                      label: (
                        <Link target="_blank" to="/delivery/edi-print/sagawa">
                          佐川
                        </Link>
                      ),
                    },
                  ],
                },
                {
                  key: '/delivery/settings',
                  icon: <SettingOutlined />,
                  label: intlMenu('delivery.settings'),
                  children: [
                    {
                      key: '/delivery/settings/driver',
                      label: (
                        <Link target="_blank" to="/delivery/settings/driver">
                          {intlMenu('setting.driver')}
                        </Link>
                      ),
                    },
                    {
                      key: '/delivery/settings/zip-area',
                      label: (
                        <Link target="_blank" to="/delivery/settings/zip-area">
                          {intlMenu('setting.zipArea')}
                        </Link>
                      ),
                    },
                  ],
                },
              ],
            },
            {
              key: '/issues',
              icon: <IssuesCloseOutlined />,
              label: intlMenu('issues'),
              children: [
                {
                  key: '/issues/clearanceIssues',
                  label: (
                    <Link target="_blank" to="/issues/clearanceIssues">
                      {intlMenu('issues.clearanceIssues')}
                    </Link>
                  ),
                },
                {
                  key: '/issues/warehouseIssues',
                  label: (
                    <Link target="_blank" to="/issues/warehouseIssues">
                      {intlMenu('issues.warehouseIssues')}
                    </Link>
                  ),
                },
                {
                  key: '/issues/inspectionIssues',
                  label: (
                    <Link target="_blank" to="/issues/inspectionIssues">
                      {intlMenu('issues.inspectionIssues')}
                    </Link>
                  ),
                },
                {
                  key: '/issues/cargoIssues',
                  label: (
                    <Link target="_blank" to="/issues/cargoIssues">
                      {intlMenu('issues.cargoIssues')}
                    </Link>
                  ),
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
