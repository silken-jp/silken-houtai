import jsPDF from 'jspdf';
import { Modal, Button } from 'antd';
import { useRef, useState } from 'react';

import renderINV from '@/services/renderINV';

export interface WaybillProps {
  dataSource: API.Waybill;
}

const Waybill: React.FC<WaybillProps> = (props) => {
  // state
  const [visibleKey, setVisibleKey] = useState<string>('');
  const printRef = useRef<HTMLCanvasElement>(null);

  // action
  const handleOpen: React.MouseEventHandler<HTMLElement> = async (e) => {
    const renderKey = e.currentTarget.getAttribute(
      'data-key',
    ) as keyof typeof renderINV;
    const ctx = printRef.current?.getContext('2d');
    if (printRef.current && ctx && renderKey) {
      await renderINV[renderKey](ctx, props.dataSource);
    }
    setVisibleKey(renderKey);
  };
  const handleClose = () => {
    setVisibleKey('');
  };
  const pdfPrint = async () => {
    if (!printRef.current) return;
    const doc = new jsPDF({
      orientation: 'p',
      format: 'a4',
    });
    const dataURI = printRef.current.toDataURL('image/jpeg', 1.0);
    doc.addImage(
      dataURI,
      'jpeg',
      0,
      0,
      doc.internal.pageSize.width,
      doc.internal.pageSize.height,
    );
    doc.save(`${props?.dataSource?.HAB}_${visibleKey}.pdf`);
  };

  return (
    <>
      <canvas
        ref={printRef}
        width={2480}
        height={3508}
        hidden
        style={{ width: 620, height: 877, background: '#FFF' }}
      />
      <Modal
        forceRender
        width={670}
        visible={!!visibleKey}
        onCancel={handleClose}
        footer={
          <Button type="primary" onClick={pdfPrint}>
            print
          </Button>
        }
      >
        <canvas
          ref={printRef}
          width={2480}
          height={3508}
          style={{ width: 620, height: 877, background: '#FFF' }}
        />
      </Modal>
      <span>{props?.dataSource.HAB}</span>
      <Button type="link" size="small" onClick={handleOpen} data-key="INV">
        INV
      </Button>
      <Button type="link" size="small" onClick={handleOpen} data-key="INV2">
        INV2
      </Button>
      <Button type="link" size="small" onClick={handleOpen} data-key="BL">
        BL
      </Button>
    </>
  );
};

export default Waybill;
