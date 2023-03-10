import { useEffect } from 'react';

import renderEDIPrint from '@/services/renderEDI/renderEDIPrint';

export interface EdiPrintProps {
  dataSource: API.Waybill;
}

const EDIPrint: React.FC<EdiPrintProps> = (props) => {
  useEffect(() => {
    if (props?.dataSource?._id) {
      const canvas = document.getElementById(
        props?.dataSource?._id,
      ) as HTMLCanvasElement;
      const ctx = canvas.getContext('2d');
      ctx && renderEDIPrint(ctx, props.dataSource);
    }
  }, [props?.dataSource?._id]);

  return (
    <div>
      <canvas
        width="1002"
        height="1502"
        style={{ width: 501, height: 751 }}
        id={props?.dataSource?._id}
      />
    </div>
  );
};

export default EDIPrint;
