import { useRef, useState } from 'react';
import { Descriptions, Space, Modal, Button, Typography, Table } from 'antd';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import dayjs from 'dayjs';

const { Title, Paragraph } = Typography;

export interface WaybillProps {
  dataSource: API.Waybill;
}

function toFloorFixed(v: number, type: string) {
  return type === 'JPY'
    ? Math.floor(v).toFixed(0)
    : (Math.floor(v * 100) / 100).toFixed(2);
}

const Waybill: React.FC<WaybillProps> = (props) => {
  // state
  const [visible, setVisible] = useState(false);
  const [viewType, setViewType] = useState('');
  const printRef = useRef<HTMLDivElement>(null);

  // data
  const _NT1 = props?.dataSource?._NT1 || 0;
  const IP3 = props?.dataSource?.IP3;
  const unitPrice = toFloorFixed(_NT1, IP3);
  const NO = props?.dataSource?.NO || 0;
  const Sum = toFloorFixed(NO * _NT1, IP3);
  const HSRepeat = props?.dataSource?.HSRepeat || [];
  const isIDA = props?.dataSource?.waybill_type === 'IDA';

  let showAttached = false;
  let data: any[] = [
    {
      ...props?.dataSource,
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
          NO,
          Price: `${IP3} ${unitPrice}`,
          Amount: `${IP3} ${Sum}`,
        },
      ];
    } else if (HSRepeat?.length === 1) {
      data = [
        {
          ...HSRepeat[0],
          Price: `${IP3} ${unitPrice}`,
          Amount: `${IP3} ${Sum}`,
        },
      ];
    }
  }

  // action
  function handleOpenINV() {
    setViewType('INV');
    setVisible(true);
  }
  function handleOpenHS() {
    setViewType('HS');
    setVisible(true);
  }
  function handleOpenBL() {
    setViewType('BL');
    setVisible(true);
  }
  function handleClose() {
    setVisible(false);
  }
  async function pdfPrint() {
    const elem = printRef.current as HTMLElement;
    const doc = new jsPDF({
      orientation: 'p',
      format: 'a4',
    });
    const canvas = await html2canvas(elem, { scale: 2 });
    const dataURI = canvas.toDataURL('image/jpeg');
    const width = doc.internal.pageSize.width;
    doc.addImage(dataURI, 'JPEG', 0, 0, width, 0);
    doc.save(`${props?.dataSource?.HAB}_${viewType}.pdf`);
  }

  return (
    <>
      <Modal
        width={900}
        visible={visible}
        onCancel={handleClose}
        footer={
          <Button type="primary" onClick={pdfPrint}>
            print
          </Button>
        }
      >
        <div style={{ padding: 48 }} ref={printRef}>
          {viewType === 'BL' && (
            <>
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
            </>
          )}
          {viewType === 'INV' && (
            <>
              <Paragraph style={{ float: 'right' }}>
                {isIDA ? '1/2' : '1/1'}
              </Paragraph>
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
              <Table
                rowKey="CMD"
                size="small"
                pagination={false}
                bordered
                dataSource={data}
                summary={() => (
                  <Table.Summary fixed>
                    <Table.Summary.Row>
                      <Table.Summary.Cell index={0}>
                        <div>TOTAL</div>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={1} colSpan={4}>
                        <div style={{ textAlign: 'right' }}>
                          {props?.dataSource?.IP3}
                          {Sum}
                        </div>
                      </Table.Summary.Cell>
                    </Table.Summary.Row>
                  </Table.Summary>
                )}
              >
                <Table.Column
                  title="Description(Material/Use)"
                  width="50%"
                  dataIndex="CMN"
                  onCell={() => (showAttached ? { colSpan: 3 } : {})}
                />
                <Table.Column
                  title="Quantity"
                  dataIndex="NO"
                  onCell={() => (showAttached ? { colSpan: 0 } : {})}
                />
                <Table.Column
                  title="Unit Price"
                  dataIndex="Price"
                  onCell={() => (showAttached ? { colSpan: 0 } : {})}
                />
                <Table.Column title="Amount" dataIndex="Amount" />
              </Table>
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
            </>
          )}
          {viewType === 'HS' && (
            <>
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
                  render={(item) => item?.DPR * item?.QN1}
                />
              </Table>
            </>
          )}
        </div>
      </Modal>
      <Space>
        {props?.dataSource?.HAB}
        <Button size="small" type="link" onClick={handleOpenINV}>
          INV
        </Button>
        {isIDA && (
          <Button size="small" type="link" onClick={handleOpenHS}>
            INV2
          </Button>
        )}
        <Button size="small" type="link" onClick={handleOpenBL}>
          BL
        </Button>
      </Space>
    </>
  );
};

export default Waybill;
