import { Typography, message, Table } from 'antd';
import dayjs from 'dayjs';
import { useLocation } from 'umi';
import { useRequest } from 'ahooks';
import { getAllWaybillsForwarder } from '@/services/request/waybill';

const { Title, Paragraph } = Typography;

const pageStyle: React.CSSProperties = {
  padding: 48,
  width: 900,
  height: 1100,
  pageBreakAfter: 'always',
};

export interface WaybillsProps {
  fileName?: string;
  loading?: boolean;
  onClick?: () => Promise<any>;
  dataSource: API.Waybill[];
}

function toFixFloor(price: any, no: any) {
  const a = Number(price) * 1000;
  const b = Number(no) * 1000;
  return (a * b) / 1000000;
}

function toFloorFixed(v: number, type: string) {
  return type === 'JPY'
    ? Math.floor(v).toFixed(0)
    : (Math.floor(v * 100) / 100).toFixed(2);
}

export interface INVProps {}
const INV: React.FC<INVProps> = (props) => {
  // state
  const location = useLocation();
  const urlParams = Object.fromEntries(new URLSearchParams(location.search));

  // api
  const downloadINVApi = useRequest(
    async () =>
      await getAllWaybillsForwarder({
        ...urlParams,
        page: 0,
        perPage: 100000000,
      }),
    {
      manual: location.search.length < 22,
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
  const dataSource: API.Waybill[] = downloadINVApi?.data?.waybills || [];

  if (location.search.length < 22) return <>検索条件を増やしてください</>;

  if (downloadINVApi.loading) return <>loading</>;

  if (dataSource.every((item) => item.LS === 'M')) {
    return <>こちらの検索条件では、IDA件が見つかりません</>;
  }
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
  const Sum = toFloorFixed(toFixFloor(_NT1, NO), IP3);

  const HSRepeat = props?.dataSource?.HSRepeat || [];
  const isIDA = props?.dataSource?.waybill_type === 'IDA';

  let showAttached = false;
  let data: any[] = [
    {
      CMN: props?.dataSource?.CMN,
      NO: props?.dataSource?.NO,
      Price: `${IP3} ${unitPrice}`,
      Amount: `${IP3} ${Sum}`,
    },
  ];
  if (isIDA) {
    if (HSRepeat?.length > 1) {
      showAttached = true;
      data = [
        {
          CMN: 'See the attached sheet',
          NO: HSRepeat.reduce(
            (res, item) => (res += Number(item?.QN1 || 0)),
            0,
          ),
          Price: `${IP3} ${unitPrice}`,
          Amount: `${IP3} ${Sum}`,
        },
      ];
    } else if (HSRepeat?.length === 1) {
      data = [
        {
          CMN: HSRepeat[0].CMN,
          NO: HSRepeat[0]?.QN1,
          Price: `${IP3} ${unitPrice}`,
          Amount: `${IP3} ${Sum}`,
        },
      ];
    }
  }

  if (props?.dataSource?.LS !== 'M') {
    return (
      <div style={pageStyle} id={props?.dataSource.HAB + 'HS'}>
        <Paragraph style={{ float: 'right' }}>2/2</Paragraph>
        <Paragraph style={{ textAlign: 'center' }}>
          {props?.dataSource?.HAB}
        </Paragraph>
        <Title level={2} style={{ textAlign: 'center' }}>
          INVOICE
        </Title>
        <Paragraph style={{ textAlign: 'right' }}>
          {`\u2002 DATE: ${dayjs(props?.dataSource?.DATE)
            .add(-1, 'day')
            .format('MM/DD/YYYY')}`}
        </Paragraph>
        <Table
          rowKey="CMD"
          size="small"
          pagination={false}
          bordered
          dataSource={props?.dataSource?.HSRepeat}
          summary={() => (
            <Table.Summary fixed>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0}>
                  <div>TOTAL</div>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1} colSpan={5}>
                  <div style={{ textAlign: 'right' }}>
                    {props?.dataSource?.IP3}
                    {Sum}
                  </div>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </Table.Summary>
          )}
        >
          <Table.Column title="DESCRIPTION" dataIndex="CMN" />
          <Table.Column title="OR" dataIndex="OR" />
          <Table.Column title="HS CODE" dataIndex="CMD" />
          <Table.Column title="QUANTITY" dataIndex="QN1" />
          <Table.Column title="UNIT PRICE" dataIndex="DPR" />
          <Table.Column
            title="PRICE"
            render={(item) =>
              toFloorFixed(toFixFloor(item?.DPR, item?.QN1), IP3)
            }
          />
        </Table>
      </div>
    );
  } else {
    return <></>;
  }
};

export default INV;
