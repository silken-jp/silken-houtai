import { useRef, useState } from 'react';
import { Descriptions, Space, Modal, Button, Typography } from 'antd';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

import { dayFormat } from '@/utils/helper/day';

const { Title } = Typography;

export interface WaybillProps {
  dataSource: API.Waybill;
}

const Waybill: React.FC<WaybillProps> = (props) => {
  // state
  const [visible, setVisible] = useState(false);
  const [viewType, setViewType] = useState('');
  const printRef = useRef<HTMLDivElement>(null);

  // data
  const _IP4 = props?.dataSource?._IP4 || 0;
  const NO = props?.dataSource?.NO || 0;

  // action
  function handleOpenINV() {
    setViewType('INV');
    setVisible(true);
  }
  function handleOpenBL() {
    setViewType('BL');
    setVisible(true);
  }
  function handleClose() {
    setVisible(false);
  }
  function pdfPrint() {
    const elem = printRef.current as HTMLElement;
    const doc = new jsPDF({
      orientation: 'p',
      format: 'a4',
    });
    html2canvas(elem, { scale: 2 }).then(function (canvas) {
      const dataURI = canvas.toDataURL('image/jpeg');
      const width = doc.internal.pageSize.width;
      doc.addImage(dataURI, 'JPEG', 0, 0, width, 0);
      doc.save(`${props?.dataSource?.HAB}.pdf`);
    });
  }

  return (
    <>
      <Modal
        title="Waybill"
        width={900}
        visible={visible}
        onCancel={handleClose}
        footer={
          <Button type="primary" onClick={pdfPrint}>
            print
          </Button>
        }
      >
        <div style={{ padding: 21 }} ref={printRef}>
          {viewType === 'BL' && (
            <Descriptions
              size="small"
              extra={
                <>
                  <div>House Air Way Bill</div>
                  <div>{props?.dataSource?.HAB}</div>
                </>
              }
              labelStyle={{ width: 120 }}
              bordered
            >
              <Descriptions.Item span={3} label="">
                Shipper/荷送人
              </Descriptions.Item>
              <Descriptions.Item span={3} label="Company Name/会社名">
                {props?.dataSource?.EPN}
              </Descriptions.Item>
              <Descriptions.Item span={3} label="Address/住所">
                {props?.dataSource?.EAD}
              </Descriptions.Item>
              <Descriptions.Item span={3} label="Phone No./電話番号">
                {props?.dataSource?.MAB}
              </Descriptions.Item>
              <Descriptions.Item span={3} label="">
                Consignee/荷受人
              </Descriptions.Item>
              <Descriptions.Item span={3} label="Company Name/会社名">
                {props?.dataSource?.MAB}
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
          )}
          {viewType === 'INV' && (
            <>
              <Title level={2} style={{ textAlign: 'center' }}>
                INVOICE
              </Title>
              <Descriptions
                size="small"
                extra={
                  <>
                    <div>{`HB\u2002NO: ${props?.dataSource?.HAB}`}</div>
                    <div>{`\u2002 DATE: ${dayFormat(
                      props?.dataSource?.DATE,
                      'MM/DD/YY',
                    )}`}</div>
                  </>
                }
                labelStyle={{ width: 150 }}
              >
                <Descriptions.Item span={3} label="">
                  Shipper/发货人
                </Descriptions.Item>
                <Descriptions.Item span={3} label="Company/公司名称">
                  {props?.dataSource?.EPN}
                </Descriptions.Item>
                <Descriptions.Item span={3} label="Name/发件人">
                  {props?.dataSource?.EPN}
                </Descriptions.Item>
                <Descriptions.Item span={3} label="Address/地址">
                  {props?.dataSource?.EAD}
                </Descriptions.Item>
                <Descriptions.Item span={3} label="Tel/电话">
                  {/* {props?.dataSource?.MAB} */}
                </Descriptions.Item>
                <Descriptions.Item span={3} label="">
                  Consignee/收件人
                </Descriptions.Item>
                <Descriptions.Item span={3} label="Company/公司名称">
                  {/* {props?.dataSource?.MAB} */}
                </Descriptions.Item>
                <Descriptions.Item span={3} label="Name/收件人">
                  {props?.dataSource?.ImpName}
                </Descriptions.Item>
                <Descriptions.Item span={3} label="Address/地址">
                  {props?.dataSource?.IAD}
                </Descriptions.Item>
                <Descriptions.Item span={2} label="Name/姓名">
                  {props?.dataSource?.ImpName}
                </Descriptions.Item>
                <Descriptions.Item span={1} label="Tel/电话">
                  {props?.dataSource?.Tel}
                </Descriptions.Item>
              </Descriptions>
              <br />
              <Descriptions size="small" layout="vertical" column={4} bordered>
                <Descriptions.Item label="Description(Material/Use)/物品内容（品名 材质 用途）">
                  <div style={{ lineHeight: '500px' }}>
                    {props?.dataSource?.CMN}
                  </div>
                </Descriptions.Item>
                <Descriptions.Item label="Quantity/物品数量">
                  {NO}
                </Descriptions.Item>
                <Descriptions.Item label="Unit Price/单价">
                  {props?.dataSource?.IP4} {props?.dataSource?.IP3}
                </Descriptions.Item>
                <Descriptions.Item label="Amount/总价">
                  {NO * _IP4} {props?.dataSource?.IP3}
                </Descriptions.Item>
              </Descriptions>
              <Descriptions
                size="small"
                column={1}
                bordered
                style={{ marginTop: -1 }}
              >
                <Descriptions.Item label="TOTAL">
                  {NO * _IP4} {props?.dataSource?.IP3}
                </Descriptions.Item>
              </Descriptions>
              <br />
              <Descriptions size="small" column={2}>
                <Descriptions.Item label="TOTAL Piece">
                  {props?.dataSource?.PCS}
                </Descriptions.Item>
                <Descriptions.Item label="Fee/运费">
                  {props?.dataSource?.FR3} {props?.dataSource?.FR2}
                </Descriptions.Item>
                <Descriptions.Item label="Signed by/签名">
                  <></>
                </Descriptions.Item>
                <Descriptions.Item label="Country Of Origin/货物原产地">
                  {props?.dataSource?.EPO}
                </Descriptions.Item>
              </Descriptions>
            </>
          )}
        </div>
      </Modal>
      <Space>
        {props?.dataSource?.HAB}
        <Button size="small" type="link" onClick={handleOpenINV}>
          INV
        </Button>
        <Button size="small" type="link" onClick={handleOpenBL}>
          BL
        </Button>
      </Space>
    </>
  );
};

export default Waybill;
