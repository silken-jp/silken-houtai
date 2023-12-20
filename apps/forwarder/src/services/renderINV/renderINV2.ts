import dayjs from 'dayjs';
import { message } from 'antd';

import { ctxLine, wrapText } from './utils';
import { getAllWaybillHSCODEs } from '../request/waybill-hscode';

function toFixFloor(price: any, no: any) {
  const a = Number(price) * 1000;
  const b = Number(no) * 1000;
  return (a * b) / 1000000;
}

async function renderINV2(ctx: CanvasRenderingContext2D, data: API.Waybill) {
  try {
    // api
    const res = await getAllWaybillHSCODEs({
      HAB: data.HAB,
      MAB: data.MAB,
    });

    let fixY = 0;
    const br = (y?: number) => (fixY += y || 100);
    const DATE = dayjs(data?.DATE).format('MM/DD/YYYY');

    ctx.reset();
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.lineWidth = 2;
    ctx.fillStyle = 'black';
    ctx.strokeStyle = 'black';

    br(200);
    ctx.textAlign = 'center';
    ctx.font = '42px msgothic';
    ctx.fillText(data.HAB, 1240, fixY);
    ctx.textAlign = 'right';
    ctx.fillText('2/2', 2330, fixY);

    br(250);
    ctx.textAlign = 'center';
    ctx.font = 'bold 84px msgothic';
    ctx.fillText('INVOICE', 1240, fixY);

    br();
    ctx.font = '42px msgothic';
    ctx.textAlign = 'left';
    ctx.fillText(data?.main_HSCODE_tax || '', 150, fixY);
    ctx.textAlign = 'right';
    ctx.fillText(`DATE:${DATE}`, 2330, fixY);
    br(65);
    ctx.textAlign = 'left';
    ctx.fillText(data?.main_HSCODE_no_tax || '', 150, fixY);
    ctx.textAlign = 'right';
    ctx.fillText(`Currency:${data?.IP3 || ''}`, 2330, fixY);

    br(50);
    ctx.fillStyle = '#f0f0f0';
    ctx.strokeStyle = '#f0f0f0';
    ctxLine(ctx, { points: [150, fixY, 2330, fixY] });
    // ctx.strokeRect(150, fixY, 2180, 2200);
    const tableStartY = fixY;

    // 第1行
    ctx.fillStyle = '#fafafa';
    ctx.strokeStyle = '#fafafa';
    ctx.fillRect(150 + 2, fixY + 2, 2180 - 4, 100 - 4);
    ctx.fillStyle = 'black';
    ctx.strokeStyle = 'black';

    ctx.textAlign = 'left';
    ctx.fillStyle = '#000';
    ctx.strokeStyle = '#000';
    ctx.font = 'bold 42px msgothic';
    ctx.fillText('DESCRIPTION', 170, fixY + 65);
    ctx.fillText('OR', 820, fixY + 65);
    ctx.fillText('HSCODE', 940, fixY + 65);
    ctx.fillText('QUANTITY', 1470, fixY + 65);
    ctx.fillText('UNIT PRICE', 1740, fixY + 65);
    ctx.fillText('PRICE', 2070, fixY + 65);
    ctx.font = '42px msgothic';

    const arr = res?.waybillhscodes || [];
    for (let index = 0; index < arr.length; index++) {
      const item = arr[index];
      br();
      ctxLine(ctx, { points: [150, fixY, 2330, fixY] });
      const extraH = wrapText(ctx, {
        text: item?.CMN || '',
        x: 170,
        y: fixY + 65,
        maxWidth: 600,
      });
      ctx.fillText(data?.OR || '', 820, fixY + 65 + extraH / 2);
      ctx.fillText(
        `${item.CMD} | ${
          item.tax_rate ? toFixFloor(item.tax_rate, 100) + '%' : 'Free'
        }`,
        940,
        fixY + 65 + extraH / 2,
      );
      ctx.fillText(item?.NO?.toString() || '', 1470, fixY + 65 + extraH / 2);
      ctx.fillText(
        item?.unit_price?.toString() || '',
        1740,
        fixY + 65 + extraH / 2,
      );
      ctx.fillText(item?.price?.toString() || '', 2070, fixY + 65 + extraH / 2);
      extraH && br(extraH);
    }

    ctxLine(ctx, { points: [800, tableStartY, 800, fixY + 100] });
    ctxLine(ctx, { points: [920, tableStartY, 920, fixY + 100] });
    ctxLine(ctx, { points: [1450, tableStartY, 1450, fixY + 100] });
    ctxLine(ctx, { points: [1720, tableStartY, 1720, fixY + 100] });
    ctxLine(ctx, { points: [2050, tableStartY, 2050, fixY + 100] });

    br();
    ctxLine(ctx, { points: [150, fixY, 2330, fixY] });
    ctxLine(ctx, { points: [150, tableStartY, 150, fixY + 100] });
    ctxLine(ctx, { points: [2330, tableStartY, 2330, fixY + 100] });
    ctx.fillText('TOTAL', 170, fixY + 65);
    ctx.textAlign = 'right';
    ctx.fillText(`${data?.IP3 || ''} ${data?.IP4 || ''}`, 2310, fixY + 65);

    br();
    ctxLine(ctx, { points: [150, fixY, 2330, fixY] });
  } catch (error) {
    message.error('');
    console.log(error);
  }
}

export default renderINV2;
