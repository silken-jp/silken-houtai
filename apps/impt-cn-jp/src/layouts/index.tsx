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
  HistoryOutlined,
  QuestionOutlined,
} from '@ant-design/icons';
import { useHistory, Link, setLocale, Helmet } from 'umi';
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
      <Helmet>
        <title>Sclogi</title>
      </Helmet>
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
                  label: <Link to="/agent/setting">フォワーダーリスト</Link>,
                },
                {
                  key: '/agent/hawb-group',
                  label: <Link to="/agent/hawb-group">HAWB区間管理</Link>,
                },
                {
                  key: '/agent/hawb',
                  label: <Link to="/agent/hawb">HAWB配布</Link>,
                },
              ],
            },
            {
              key: '/user',
              icon: <UserOutlined />,
              label: <Link to="/user">ユーザー管理</Link>,
            },
            {
              key: '/company',
              icon: <SettingOutlined />,
              label: <Link to="/company">会社設定</Link>,
            },
            {
              key: '/waybill',
              icon: <FormOutlined />,
              label: '通関管理',
              children: [
                {
                  key: '/waybill/dashboard',
                  label: <Link to="/waybill/dashboard">Dashboard</Link>,
                },
                {
                  key: '/waybill/cts',
                  label: '通関',
                  children: [
                    {
                      key: '/waybill/cts/MAWB',
                      label: <Link to="/waybill/cts/MAWB">MAWB</Link>,
                    },
                    {
                      key: '/waybill/cts/HAWB',
                      label: <Link to="/waybill/cts/HAWB">HAWB</Link>,
                    },
                  ],
                },
                {
                  key: '/waybill/Tracking',
                  label: <Link to="/waybill/Tracking">通関結果</Link>,
                },
              ],
            },
            {
              key: '/cts',
              icon: <FormOutlined />,
              label: '通関管理 old',
              children: [
                {
                  key: '/cts/dashboard',
                  label: <Link to="/cts/dashboard">Dashboard</Link>,
                },
                {
                  key: '/cts/todo',
                  label: 'Todo',
                  children: [
                    {
                      key: '/cts/todo/today',
                      label: <Link to="/cts/todo/today">Today</Link>,
                    },
                    {
                      key: '/cts/todo/other',
                      label: <Link to="/cts/todo/other">Other</Link>,
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
                  label: <Link to="/cts/large">IDA-Large</Link>,
                },
                {
                  key: '/cts/small',
                  label: <Link to="/cts/small">IDA-Small</Link>,
                },
                {
                  key: '/cts/manifest',
                  label: <Link to="/cts/manifest">MIC</Link>,
                },
                {
                  key: '/cts/settings',
                  icon: <SettingOutlined />,
                  label: '通関設定',
                  children: [
                    {
                      key: '/cts/settings/CMN',
                      label: <Link to="/cts/settings/CMN">品名管理</Link>,
                    },
                    {
                      key: '/cts/settings/GW_FR3',
                      label: <Link to="/cts/settings/GW_FR3">運賃管理</Link>,
                    },
                    {
                      key: '/cts/settings/GW_IP4',
                      label: (
                        <Link to="/cts/settings/GW_IP4">
                          インボイス価格管理
                        </Link>
                      ),
                    },
                    {
                      key: '/cts/settings/Currency',
                      label: (
                        <Link to="/cts/settings/Currency">為替レート管理</Link>
                      ),
                    },
                    {
                      key: '/cts/settings/Importer',
                      label: (
                        <Link to="/cts/settings/Importer">法人輸入者管理</Link>
                      ),
                    },
                    {
                      key: '/cts/settings/MICkey',
                      label: (
                        <Link to="/cts/settings/MICkey">フォルダ変更管理</Link>
                      ),
                    },
                    {
                      key: '/cts/settings/BlackList',
                      label: (
                        <Link to="/cts/settings/BlackList">
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
                      label: <Link to="/delivery/todo/check">Check</Link>,
                    },
                    {
                      key: '/delivery/todo/timeoutList',
                      label: (
                        <Link to="/delivery/todo/timeoutList">
                          Timeout List
                        </Link>
                      ),
                    },
                  ],
                },
                {
                  key: '/delivery/self',
                  label: (
                    <Link to="/delivery/self">{intlMenu('delivery.self')}</Link>
                  ),
                },
                {
                  key: '/delivery/other',
                  label: intlMenu('delivery.other'),
                  children: [
                    {
                      key: '/delivery/other/dashboard',
                      label: (
                        <Link to="/delivery/other/dashboard">Dashboard</Link>
                      ),
                    },
                    {
                      key: '/delivery/other/sagawa',
                      label: <Link to="/delivery/other/sagawa">佐川</Link>,
                    },
                  ],
                },
                {
                  key: '/delivery/edi',
                  label: 'EDI',
                  children: [
                    {
                      key: '/delivery/edi/sagawa',
                      label: <Link to="/delivery/edi/sagawa">佐川</Link>,
                    },
                    // {
                    //   key: '/delivery/edi/seino',
                    //   label: <Link to="/delivery/edi/seino">西濃</Link>,
                    // },
                  ],
                },
                {
                  key: '/delivery/edi-print',
                  label: '送り状',
                  children: [
                    {
                      key: '/delivery/edi-print/sagawa',
                      label: <Link to="/delivery/edi-print/sagawa">佐川</Link>,
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
                        <Link to="/delivery/settings/driver">
                          {intlMenu('setting.driver')}
                        </Link>
                      ),
                    },
                    {
                      key: '/delivery/settings/zip-area',
                      label: (
                        <Link to="/delivery/settings/zip-area">
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
              icon: <QuestionOutlined />,
              label: <Link to="/issues">问题件</Link>,
            },
            {
              key: '/history',
              icon: <HistoryOutlined />,
              label: 'バックアップデータ',
              children: [
                {
                  key: '/history/waybills',
                  label: <Link to="/history/waybills">貨物データ</Link>,
                },
                {
                  key: '/history/trackings',
                  label: <Link to="/history/trackings">通関データ</Link>,
                },
                {
                  key: '/history/tracks',
                  label: <Link to="/history/tracks">配送データ</Link>,
                },
              ],
            },
            // {
            //   key: '/issues',
            //   icon: <IssuesCloseOutlined />,
            //   label: intlMenu('issues'),
            //   children: [
            //     {
            //       key: '/issues/clearanceIssues',
            //       label: (
            //         <Link to="/issues/clearanceIssues">
            //           {intlMenu('issues.clearanceIssues')}
            //         </Link>
            //       ),
            //     },
            //     {
            //       key: '/issues/warehouseIssues',
            //       label: (
            //         <Link to="/issues/warehouseIssues">
            //           {intlMenu('issues.warehouseIssues')}
            //         </Link>
            //       ),
            //     },
            //     {
            //       key: '/issues/inspectionIssues',
            //       label: (
            //         <Link to="/issues/inspectionIssues">
            //           {intlMenu('issues.inspectionIssues')}
            //         </Link>
            //       ),
            //     },
            //     {
            //       key: '/issues/cargoIssues',
            //       label: (
            //         <Link to="/issues/cargoIssues">
            //           {intlMenu('issues.cargoIssues')}
            //         </Link>
            //       ),
            //     },
            //   ],
            // },
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
