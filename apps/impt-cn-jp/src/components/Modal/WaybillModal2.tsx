import { useRef, useState } from 'react';
import { Space, Modal, Button } from 'antd';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import dayjs from 'dayjs';

export interface WaybillProps {
  dataSource: API.Waybill;
}

function toFloorFixed(v: number, type: string) {
  return type === 'JPY'
    ? Math.floor(v).toFixed(0)
    : (Math.floor(v * 100) / 100).toFixed(2);
}

interface INVCellProps {
  text?: React.ReactNode;
  children?: React.ReactNode;
  label?: string;
  w?: number | string;
  h?: number | string;
  bg?: string;
  size?: number;
  unFlex?: boolean;
  flexX?: 'start' | 'end' | 'center';
  flexY?: 'start' | 'end' | 'center';
}
const INVCell: React.FC<INVCellProps> = (props) => {
  const style: React.CSSProperties = {
    border: '1px solid black',
    display: props?.unFlex ? 'block' : 'flex',
    alignItems: props?.flexY || 'center',
    justifyContent: props?.flexX || 'center',
    margin: -1,
    width: props?.w,
    height: props?.h,
    backgroundColor: props?.bg || '#fff',
    fontSize: props?.size || 10,
  };
  return (
    <div style={style}>
      {props.text}
      {props.children}
    </div>
  );
};

interface LabelCell {
  label: string;
  value: string;
}
const LabelCell: React.FC<LabelCell> = (props) => {
  return (
    <div style={{ width: '100%', margin: 4 }}>
      <div style={{ fontSize: 10 }}>{props?.label}</div>
      <div style={{ fontSize: 13, fontWeight: 800 }}>{props?.value}</div>
    </div>
  );
};

const Waybill: React.FC<WaybillProps> = (props) => {
  // state
  const [visible, setVisible] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  // data
  const _NT1 = props?.dataSource?._NT1 || 0;
  const FR3 = Number(props?.dataSource?.FR3 || 0);
  const IP3 = props?.dataSource?.IP3;
  const HAB = props?.dataSource?.HAB;
  const NO = props?.dataSource?.NO || 0;
  const GW = Number(props?.dataSource?.GW || 0);
  const weight = GW + props?.dataSource?.GWT;
  const total = toFloorFixed(NO * _NT1, IP3);
  const freight = toFloorFixed(GW * FR3, IP3);
  const HSRepeat = props?.dataSource?.HSRepeat || [];

  // action
  function handleOpen() {
    setVisible(true);
  }
  function handleClose() {
    setVisible(false);
  }
  async function pdfPrint() {
    const elem = printRef.current as HTMLElement;
    const doc = new jsPDF({
      orientation: 'l',
      format: 'a4',
    });
    const canvas = await html2canvas(elem, { scale: 2 });
    const dataURI = canvas.toDataURL('image/jpeg');
    const width = doc.internal.pageSize.width;
    doc.addImage(dataURI, 'JPEG', 0, 0, width, 0);
    doc.save(`${props?.dataSource?.HAB}.pdf`);
  }

  return (
    <>
      <Modal
        width={1600}
        visible={visible}
        onCancel={handleClose}
        footer={
          <Button type="primary" onClick={pdfPrint}>
            print
          </Button>
        }
      >
        <div style={{ padding: 48 }} ref={printRef}>
          <div style={{ display: 'flex' }}>
            <div>
              <INVCell
                w={700}
                h={50}
                size={21}
                bg="#eee"
                flexY="start"
                text="Commercial Invoice"
              />
              <INVCell w={700} h={30} size={18} bg="#eee" text="02/28/2022" />
              <INVCell w={700} h={50} />
              <div style={{ display: 'flex' }}>
                <INVCell w={252} size={12} bg="#eee" text="HAWB" />
                <INVCell w={102} size={12} bg="#eee" text="Box Count" />
                <INVCell w={102} size={12} bg="#eee" text="Total Weight" />
                <INVCell w={101} size={12} bg="#eee" text="Freight Value" />
                <INVCell w={151} size={12} bg="#eee" text="Total Value" />
              </div>
              <div style={{ display: 'flex' }}>
                <INVCell w={252} h={50} size={14} flexY="end" text={HAB} />
                <INVCell w={102} h={50} size={14} flexY="end" text={NO} />
                <INVCell w={102} h={50} size={14} flexY="end" text={weight} />
                <INVCell
                  w={101}
                  h={50}
                  size={14}
                  flexY="end"
                  text={`${IP3} ${freight}`}
                />
                <INVCell
                  w={151}
                  h={50}
                  size={14}
                  flexY="end"
                  text={`${IP3} ${total}`}
                />
              </div>
              <div style={{ display: 'flex' }}>
                <INVCell
                  w={401}
                  h={24}
                  size={14}
                  flexX="end"
                  text="Duties Value:　"
                />
                <INVCell w={202} h={24} size={14} text="" />
                <INVCell w={101} h={24} size={14} text="" />
              </div>
              <div style={{ display: 'flex' }}>
                <INVCell w={301} h={21} bg="#eee" text="DESCRIPTION" />
                <INVCell w={62} h={21} bg="#eee" text="OR" />
                <INVCell w={102} h={21} bg="#eee" text="HS CODE" />
                <INVCell w={72} h={21} bg="#eee" text="QUANTITY" />
                <INVCell w={82} h={21} bg="#eee" text="UNIT PRICE" />
                <INVCell w={91} h={21} bg="#eee" text="PRICE" />
              </div>
              {HSRepeat?.map((row, i) => (
                <div key={i} style={{ display: 'flex' }}>
                  <INVCell w={301} h={21} text={row?.CMN} />
                  <INVCell w={62} h={21} text={row?.OR} />
                  <INVCell w={102} h={21} text={row?.CMD} />
                  <INVCell w={72} h={21} text={row?.QN1} />
                  <INVCell w={82} h={21} text={row?.DPR} />
                  <INVCell
                    w={91}
                    h={21}
                    text={Number(row?.DPR || 0) * Number(row?.QN1 || 0)}
                  />
                </div>
              ))}
              <div style={{ display: 'flex' }}>
                <INVCell w={461} h={21} bg="#eee" flexX="end" text="Total:　" />
                <INVCell w={241} h={21} text={`${IP3} ${total}`} />
              </div>
              <div style={{ display: 'flex' }}>
                <INVCell w={301} h={720 - HSRepeat.length * 21} />
                <INVCell w={62} h={720 - HSRepeat.length * 21} />
                <INVCell w={102} h={720 - HSRepeat.length * 21} />
                <INVCell w={72} h={720 - HSRepeat.length * 21} />
                <INVCell w={82} h={720 - HSRepeat.length * 21} />
                <INVCell w={91} h={720 - HSRepeat.length * 21} />
              </div>
              <div style={{ display: 'flex' }}>
                <INVCell w={700} h={50} />
              </div>
            </div>
            <div>
              <INVCell w={350} h={100} unFlex></INVCell>
              <div style={{ display: 'flex' }}>
                <INVCell w={176} h={50}></INVCell>
                <INVCell w={176} h={50} />
              </div>
              <INVCell w={350} h={80} />
              <INVCell w={350} h={50} />
              <INVCell w={350} h={110} />
              <div style={{ display: 'flex' }}>
                <INVCell w={176} h={50} />
                <INVCell w={176} h={50} />
              </div>
              <div style={{ display: 'flex' }}>
                <INVCell w={176} h={50} />
                <INVCell w={176} h={50} />
              </div>
              <div style={{ display: 'flex' }}>
                <INVCell w={176} h={50} />
                <INVCell w={176} h={50} />
              </div>
              <div style={{ display: 'flex' }}>
                <INVCell w={176} h={50} />
                <INVCell w={176} h={50} />
              </div>
              <INVCell w={350} h={21} />
              <div style={{ display: 'flex' }}>
                <INVCell w={89} h={50} />
                <INVCell w={89} h={50} />
                <INVCell w={89} h={50} />
                <INVCell w={89} h={50} />
              </div>
              <div style={{ display: 'flex' }}>
                <INVCell w={89} h={50} />
                <INVCell w={89} h={50} />
                <INVCell w={89} h={50} />
                <INVCell w={89} h={50} />
              </div>
              <INVCell w={350} h={21} />
              <div style={{ display: 'flex' }}>
                <INVCell w={176} h={50} />
                <INVCell w={176} h={50} />
              </div>
              <div style={{ display: 'flex' }}>
                <INVCell w={176} h={80} />
                <INVCell w={176} h={80} />
              </div>
              <INVCell w={350} h={21} />
              <div style={{ display: 'flex' }}>
                <INVCell w={176} h={80} />
                <INVCell w={176} h={80} />
              </div>
              <div style={{ display: 'flex' }}>
                <INVCell w={176} h={80} />
                <INVCell w={176} h={80} />
              </div>
            </div>
            <div>
              <div style={{ display: 'flex' }}>
                <INVCell w={176} h={50} />
                <INVCell w={176} h={50} />
              </div>
              <div style={{ display: 'flex' }}>
                <INVCell w={176} h={40} />
                <INVCell w={176} h={40} />
              </div>
              <INVCell w={350} h={141} />
              <div style={{ display: 'flex' }}>
                <INVCell w={176} h={111} />
                <INVCell w={176} h={111} />
              </div>{' '}
              <div style={{ display: 'flex' }}>
                <INVCell w={176} h={50} />
                <INVCell w={176} h={50} />
              </div>{' '}
              <div style={{ display: 'flex' }}>
                <INVCell w={176} h={50} />
                <INVCell w={176} h={50} />
              </div>{' '}
              <div style={{ display: 'flex' }}>
                <INVCell w={176} h={50} />
                <INVCell w={176} h={50} />
              </div>{' '}
              <div style={{ display: 'flex' }}>
                <INVCell w={176} h={50} />
                <INVCell w={176} h={50} />
              </div>{' '}
              <div style={{ display: 'flex' }}>
                <INVCell w={176} h={51} />
                <INVCell w={176} h={51} />
              </div>
              <div style={{ display: 'flex' }}>
                <INVCell w={176} h={115} />
                <INVCell w={176} h={115} />
              </div>
              <INVCell w={350} h={323} />
            </div>
          </div>
        </div>
      </Modal>
      <Space>
        {props?.dataSource?.HAB}
        <Button size="small" type="link" onClick={handleOpen}>
          INV&BL
        </Button>
      </Space>
    </>
  );
};

export default Waybill;
