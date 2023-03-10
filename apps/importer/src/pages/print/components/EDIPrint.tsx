import { useEffect } from 'react';

import renderEDIPrint from '@/services/renderEDI/renderEDICodes';

export interface EdiPrintProps {
  dataSource: API.Waybill[];
  page: string;
}

const EDIPrint: React.FC<EdiPrintProps> = (props) => {
  useEffect(() => {
    if (props?.dataSource?.[0]?._id) {
      const canvas = document.getElementById(
        props?.dataSource?.[0]?._id,
      ) as HTMLCanvasElement;
      const ctx = canvas.getContext('2d');
      ctx && renderEDIPrint(ctx, props.dataSource, props.page);
    }
  }, [props?.dataSource?.[0]?._id]);

  return (
    <div>
      <canvas
        width="1002"
        height="1502"
        style={{ width: 501, height: 751 }}
        id={props?.dataSource?.[0]?._id}
      />
    </div>
  );
};

export default EDIPrint;
