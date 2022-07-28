import { Descriptions, Typography, message } from 'antd';
import dayjs from 'dayjs';
import { useLocation } from 'umi';
import { useRequest } from 'ahooks';
import { getAllWaybillsAdvance } from '@/services/request/waybill';

const { Title, Paragraph } = Typography;

export interface WaybillsProps {
  fileName?: string;
  loading?: boolean;
  onClick?: () => Promise<any>;
  dataSource: API.Waybill[];
}

function toFloorFixed(v: number, type: string) {
  return type === 'JPY'
    ? Math.floor(v).toFixed(0)
    : (Math.floor(v * 100) / 100).toFixed(2);
}

export interface INV_BLProps {}
const INV_BL: React.FC<INV_BLProps> = (props) => {
  // state
  const location = useLocation();
  const urlParams = Object.fromEntries(new URLSearchParams(location.search));

  // api
  const downloadINVBLApi = useRequest(
    async () =>
      await getAllWaybillsAdvance({
        ...urlParams,
        page: 0,
        perPage: 100000000,
      }),
    {
      onSuccess: (res) => {
        if (res?.waybills?.length > 0) {
          window.print();
        } else {
          message.error('条件を満たすHABを見つかりません。');
        }
      },
      onError: (err) => {
        message.error(err?.message);
      },
    },
  );
  const dataSource: API.Waybill[] = downloadINVBLApi?.data?.waybills || [];

  if (downloadINVBLApi.loading) return <>loading</>;

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: 900 }}>
        {dataSource?.map((item) => {
          return <Waybill key={item._id} dataSource={item} />;
        })}
      </div>
    </div>
  );
};

export interface WaybillProps {
  dataSource: API.Waybill;
}
const Waybill: React.FC<WaybillProps> = (props) => {
  // data
  const _NT1 = props?.dataSource?._NT1 || 0;
  const IP3 = props?.dataSource?.IP3;
  const unitPrice = toFloorFixed(_NT1, IP3);
  const NO = props?.dataSource?.NO || 0;
  const Sum = toFloorFixed(NO * _NT1, IP3);

  return (
    <>
      <div style={{ padding: 48 }} id={props?.dataSource.HAB + 'INV'}>
        <Paragraph style={{ textAlign: 'center' }}>
          {props?.dataSource?.HAB}
        </Paragraph>
        <Title level={2} style={{ textAlign: 'center' }}>
          INVOICE
        </Title>
        <Descriptions
          size="small"
          extra={`\u2002 DATE: ${dayjs(props?.dataSource?.DATE)
            .add(-1, 'day')
            .format('MM/DD/YYYY')}`}
          labelStyle={{ width: 150 }}
        >
          <Descriptions.Item span={3} label="">
            Shipper
          </Descriptions.Item>
          <Descriptions.Item span={3} label="Shipper Name">
            {props?.dataSource?.EPN}
          </Descriptions.Item>
          <Descriptions.Item span={3} label="Address">
            {props?.dataSource?.EAD}
          </Descriptions.Item>
          <Descriptions.Item span={3} label="Zip">
            {props?.dataSource?.EPY_Zip}
          </Descriptions.Item>
          <Descriptions.Item span={3} label="Tel">
            {/* {props?.dataSource?.MAB} */}
          </Descriptions.Item>
          <Descriptions.Item span={3} label="Contact">
            {/* {props?.dataSource?.Tel} */}
          </Descriptions.Item>
          <Descriptions.Item span={3} label="">
            <br />
            Consignee
          </Descriptions.Item>
          <Descriptions.Item span={3} label="Consignee Name">
            {props?.dataSource?.ImpName}
          </Descriptions.Item>
          <Descriptions.Item span={3} label="Address">
            {props?.dataSource?.IAD}
          </Descriptions.Item>
          <Descriptions.Item span={3} label="Zip">
            {props?.dataSource?.Zip}
          </Descriptions.Item>
          <Descriptions.Item span={3} label="Tel">
            {props?.dataSource?.Tel}
          </Descriptions.Item>
          <Descriptions.Item span={3} label="Contact">
            {/* {props?.dataSource?.Tel} */}
          </Descriptions.Item>
        </Descriptions>
        <br />
        <Descriptions size="small" column={2}>
          <Descriptions.Item label="Incoterms">
            {props?.dataSource?.IP2}
          </Descriptions.Item>
          <Descriptions.Item label="Currency">
            {props?.dataSource?.IP3}
          </Descriptions.Item>
        </Descriptions>
        <Descriptions size="small" layout="vertical" column={4} bordered>
          <Descriptions.Item
            label="Description(Material/Use)"
            labelStyle={{
              display: 'block',
              width: 180,
            }}
            contentStyle={{
              lineHeight: '150px',
            }}
          >
            {props?.dataSource?.CMN}
          </Descriptions.Item>
          <Descriptions.Item
            label="Quantity"
            labelStyle={{
              display: 'block',
              width: 60,
            }}
            contentStyle={{
              display: 'block',
              width: '100%',
              textAlign: 'right',
            }}
          >
            {NO}
          </Descriptions.Item>
          <Descriptions.Item
            label="Unit Price"
            labelStyle={{
              display: 'block',
              width: 80,
            }}
            contentStyle={{
              display: 'block',
              width: '100%',
              textAlign: 'right',
            }}
          >
            {props?.dataSource?.IP3} {unitPrice}
          </Descriptions.Item>
          <Descriptions.Item
            label="Amount"
            labelStyle={{
              display: 'block',
              width: 80,
            }}
            contentStyle={{
              display: 'block',
              width: '100%',
              textAlign: 'right',
            }}
          >
            {props?.dataSource?.IP3} {Sum}
          </Descriptions.Item>
        </Descriptions>
        <Descriptions
          size="small"
          column={1}
          bordered
          style={{ marginTop: -1 }}
        >
          <Descriptions.Item
            label="TOTAL"
            labelStyle={{ width: 120 }}
            contentStyle={{ textAlign: 'right' }}
          >
            {props?.dataSource?.IP3} {Sum}
          </Descriptions.Item>
        </Descriptions>
        <br />
        <Descriptions size="small" column={2}>
          <Descriptions.Item label="TOTAL Piece">
            {props?.dataSource?.PCS}
          </Descriptions.Item>
          <Descriptions.Item label="Freight">
            {props?.dataSource?.FR3} {props?.dataSource?.FR2}
          </Descriptions.Item>
          <Descriptions.Item label="Signed by">
            <></>
          </Descriptions.Item>
          <Descriptions.Item label="Country Of Origin">
            {props?.dataSource?.OR}
          </Descriptions.Item>
        </Descriptions>
      </div>
      <div
        style={{ padding: 48, pageBreakAfter: 'always' }}
        id={props?.dataSource.HAB + 'BL'}
      >
        <Title level={2} style={{ textAlign: 'center' }}>
          {props?.dataSource?.HAB}
        </Title>
        <Title level={3} style={{ textAlign: 'center' }}>
          Air Way Bill
        </Title>
        <br />
        <Descriptions size="small" labelStyle={{ width: 120 }} bordered>
          <Descriptions.Item span={3} label="">
            Shipper/輸出者
          </Descriptions.Item>
          <Descriptions.Item span={3} label="Shipper Name/名前">
            {props?.dataSource?.EPN}
          </Descriptions.Item>
          <Descriptions.Item span={3} label="Zip/郵便番号">
            {props?.dataSource?.EPY_Zip}
          </Descriptions.Item>
          <Descriptions.Item span={3} label="Address/住所">
            {props?.dataSource?.EAD}
          </Descriptions.Item>
          <Descriptions.Item span={3} label="Phone No./電話番号">
            {/* {props?.dataSource?.MAB} */}
          </Descriptions.Item>
          <Descriptions.Item span={3} label="">
            Consignee/荷受人
          </Descriptions.Item>
          <Descriptions.Item span={3} label="Consignee Name/名前">
            {props?.dataSource?.ImpName}
          </Descriptions.Item>
          <Descriptions.Item span={3} label="Zip/郵便番号">
            {props?.dataSource?.Zip}
          </Descriptions.Item>
          <Descriptions.Item span={3} label="Address/住所">
            {props?.dataSource?.IAD}
          </Descriptions.Item>
          <Descriptions.Item span={3} label="Phone No./電話番号">
            {props?.dataSource?.Tel}
          </Descriptions.Item>
          <Descriptions.Item span={1} label="Product name/品名">
            {props?.dataSource?.CMN}
          </Descriptions.Item>
          <Descriptions.Item
            span={2}
            label={
              <>
                <div>Pcs/個数</div>
                <div>Weight/重量</div>
                <div>Fare/運賃</div>
              </>
            }
          >
            <div>{props?.dataSource?.PCS}</div>
            <div>
              {props?.dataSource?.GW} {props?.dataSource?.GWT}
            </div>
            <div>
              {props?.dataSource?.FR3} {props?.dataSource?.FR2}
            </div>
          </Descriptions.Item>
        </Descriptions>
      </div>
    </>
  );
};

export default INV_BL;
