import { useEffect, useRef, useState } from 'react';
import { Space, Modal, Button } from 'antd';
import jsPDF from 'jspdf';
////
import renderEDIPrint from '@/services/renderEDI/renderEDIPrint';

export interface EdiPrintProps {
  dataSource: API.Waybill;
}

const EDIPrint: React.FC<EdiPrintProps> = (props) => {
  // state
  const [visible, setVisible] = useState(false);
  const printRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const ctx = printRef.current?.getContext('2d');
    ctx && renderEDIPrint(ctx, props.dataSource);
  }, [visible]);

  // action
  function handleOpen() {
    setVisible(true);
  }
  function handleClose() {
    setVisible(false);
  }
  function pdfPrint() {
    if (!printRef.current) return;
    const doc = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: [100.2, 150.2],
    });
    const dataURI = printRef.current.toDataURL('image/png', 1.0);
    doc.addImage(dataURI, 'PNG', 0.1, 0.1, 100, 150);
    doc.save(`${props?.dataSource?.HAB}.pdf`);
    handleClose();
  }

  return (
    <>
      <Modal
        title={props?.dataSource?.HAB}
        width={650}
        visible={visible}
        onCancel={handleClose}
        footer={
          <Button type="primary" onClick={pdfPrint}>
            Download
          </Button>
        }
      >
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <canvas
            id={props?.dataSource?._id}
            ref={printRef}
            width="1002"
            height="1502"
            style={{ width: 501, height: 751, background: '#FFF' }}
          />
        </div>
        <img id="aaaa" />
      </Modal>
      <Space>
        <Button size="small" type="link" onClick={handleOpen}>
          Download
        </Button>
      </Space>
    </>
  );
};

export default EDIPrint;
