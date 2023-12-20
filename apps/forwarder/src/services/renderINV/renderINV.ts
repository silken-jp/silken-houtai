import dayjs from 'dayjs';
import { message } from 'antd';

import { wrapText, ctxLine } from './utils';

export async function renderINV(
  ctx: CanvasRenderingContext2D,
  data: API.Waybill,
) {
  try {
    let fixY = 0;
    const br = (y?: number) => (fixY += y || 100);
    const isIDA = data?.waybill_type === 'IDA';
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
    isIDA && ctx.fillText('1/2', 2330, fixY);

    br(250);
    ctx.textAlign = 'center';
    ctx.font = 'bold 84px msgothic';
    ctx.fillText('INVOICE', 1240, fixY);

    br();
    ctx.textAlign = 'right';
    ctx.font = '42px msgothic';
    ctx.fillText(`DATE:${DATE}`, 2330, fixY);

    // Shipper
    br();
    ctx.textAlign = 'left';
    ctx.fillText('Shipper', 150, fixY);
    br();
    ctx.fillText('Shipper Name:', 150, fixY);
    ctx.fillText(data?.EPN || '', 600, fixY);
    br();
    ctx.fillText('Address:', 150, fixY);
    fixY += wrapText(ctx, {
      text: data?.EAD || '',
      x: 600,
      y: fixY,
      maxWidth: 1700,
    });
    br();
    ctx.fillText('Zip:', 150, fixY);
    ctx.fillText(data?.EPY_Zip || '', 600, fixY);
    br();
    ctx.fillText('Tel:', 150, fixY);
    // ctx.fillText(data?.Zip, 600, 1050 + fixY);
    br();
    ctx.fillText('Contact:', 150, fixY);
    // ctx.fillText(data?.Zip, 600, 1150 + fixY);

    // Consignee
    br(200);
    ctx.fillText('Consignee', 150, fixY);
    br();
    ctx.fillText('Consignee Name:', 150, fixY);
    ctx.fillText(data?.ImpName || '', 600, fixY);
    br();
    ctx.fillText('Address:', 150, fixY);
    fixY += wrapText(ctx, {
      text: data?.IAD || '',
      x: 600,
      y: fixY,
      maxWidth: 1700,
    });
    br();
    ctx.fillText('Zip:', 150, fixY);
    ctx.fillText(data?.Zip || '', 600, fixY);
    br();
    ctx.fillText('Tel:', 150, fixY);
    ctx.fillText(data?.Tel || '', 600, fixY);
    br();
    ctx.fillText('Contact:', 150, fixY);
    // ctx.fillText(data?.Zip, 600, 1150 + fixY);

    br(200);
    ctx.fillText('Incoterms:', 150, fixY);
    ctx.fillText(data?.IP2 || '', 350, fixY);
    ctx.fillText('Currency:', 1200, fixY);
    ctx.fillText(data?.IP3 || '', 1450, fixY);

    // table
    br(50);
    ctx.fillStyle = '#f0f0f0';
    ctx.strokeStyle = '#f0f0f0';
    ctx.strokeRect(150, fixY, 2180, 300);
    ctxLine(ctx, { points: [150, fixY + 100, 2330, fixY + 100] });
    ctxLine(ctx, { points: [150, fixY + 200, 2330, fixY + 200] });

    // 第1行
    ctx.fillStyle = '#fafafa';
    ctx.strokeStyle = '#fafafa';
    ctx.fillRect(150 + 2, fixY + 2, 2180 - 4, 100 - 4);
    ctx.fillStyle = 'black';
    ctx.strokeStyle = 'black';

    ctx.font = 'bold 42px msgothic';
    ctx.fillText('Description(Material/Use)', 170, fixY + 65);
    ctxLine(ctx, { points: [1600, fixY, 1600, fixY + 100] });
    ctx.fillText('Quantity', 1620, fixY + 65);
    ctxLine(ctx, { points: [1950, fixY, 1950, fixY + 100] });
    ctx.fillText('Amount', 1970, fixY + 65);
    // 第2行
    br();
    ctx.font = '42px msgothic';
    isIDA && ctx.fillText('See the attached sheet', 170, fixY + 65);
    !isIDA && ctx.fillText(data?.CMN || '', 170, fixY + 65);
    ctxLine(ctx, { points: [1600, fixY, 1600, fixY + 100] });
    ctx.fillText(data?.NO?.toString() || '', 1620, fixY + 65);
    ctxLine(ctx, { points: [1950, fixY, 1950, fixY + 100] });
    ctx.fillText(`${data?.IP3 || ''} ${data?.IP4 || ''}`, 1970, fixY + 65);
    // 第3行
    br();
    ctx.fillText('TOTAL', 170, fixY + 65);
    ctx.textAlign = 'right';
    ctx.fillText(`${data?.IP3 || ''} ${data?.IP4 || ''}`, 2310, fixY + 65);

    // 总结
    br(215);
    ctx.textAlign = 'left';
    ctx.fillText('TOTAL Piece:', 150, fixY);
    ctx.fillText(data?.PCS?.toString() || '', 450, fixY);
    ctx.fillText('Freight:', 1200, fixY);
    ctx.fillText(`${data?.FR3 || ''} ${data?.FR2 || ''}`, 1450, fixY);
    br();
    ctx.fillText('Signed by:', 150, fixY);
    // ctx.fillText(data?.IP2 || "", 350, fixY);
    ctx.fillText('Country Of Origin:', 1200, fixY);
    ctx.fillText(data?.OR || '', 1650, fixY);

    if (isIDA) {
      br(200);
      ctx.fillText('本件、個人使用の為、下記の様に申告致します。', 150, fixY);
      br();
      ctx.fillText(data?.NT1 || '', 150, fixY);
    }
  } catch (error) {
    message.error('');
    console.log(error);
  }
}

export default renderINV;
