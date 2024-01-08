import { message } from 'antd';

import { wrapText, ctxLine } from './utils';

async function renderBL(ctx: CanvasRenderingContext2D, data: API.Waybill) {
  try {
    let fixY = 0;
    const br = (y?: number) => (fixY += y || 100);

    ctx.reset();
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.lineWidth = 2;
    ctx.fillStyle = 'black';
    ctx.strokeStyle = 'black';

    br(250);
    ctx.textAlign = 'center';
    ctx.font = 'bold 84px  msgothic';
    ctx.fillText(data.HAB, 1240, fixY);

    br(200);
    ctx.font = 'bold 72px  msgothic';
    ctx.fillText('Air Way Bill', 1240, fixY);

    br(100);
    ctx.strokeStyle = '#eee';
    ctx.strokeRect(150, fixY, 2180, 2200);
    ctxLine(ctx, { points: [550, fixY, 500, fixY + 2200] });
    ctx.strokeStyle = 'black';

    // 第1列背景
    ctx.font = '42px msgothic';
    ctx.textAlign = 'left';
    ctx.fillStyle = '#fafafa';
    ctx.fillRect(150 + 2, fixY + 2, 400 - 4, 2200 - 4);
    ctx.fillStyle = 'black';

    // Shipper/輸出者
    ctxLine(ctx, { points: [550, fixY + 150, 2330, fixY + 150] });
    br();
    ctx.fillText('Shipper/輸出者', 600, fixY);
    br(250);
    ctxLine(ctx, { points: [550, fixY, 2330, fixY] });
    ctx.fillText('Shipper Name', 200, fixY - 120);
    ctx.fillText('/名前', 200, fixY - 50);
    ctx.fillText(data?.EPN || '', 600, fixY - 80);
    br(150);
    ctxLine(ctx, { points: [550, fixY, 2330, fixY] });
    ctx.fillText('Zip/郵便番号', 200, fixY - 60);
    ctx.fillText(data?.EPY_Zip || '', 600, fixY - 60);
    br(250);
    ctxLine(ctx, { points: [550, fixY, 2330, fixY] });
    ctx.fillText('Address/住所', 200, fixY - 100);
    wrapText(ctx, {
      text: data?.EAD || '',
      x: 600,
      y: fixY - 120,
      maxWidth: 1700,
    });
    br(200);
    ctxLine(ctx, { points: [550, fixY, 2330, fixY] });
    ctx.fillText('Phone No.', 200, fixY - 120);
    ctx.fillText('/電話番号', 200, fixY - 50);
    // ctx.fillText(data?.EPY_Zip || "", 600, fixY - 60);

    // Consignee/荷受人
    ctxLine(ctx, { points: [550, fixY + 150, 2330, fixY + 150] });
    br();
    ctx.fillText('Consignee/荷受人', 600, fixY);

    br(250);
    ctxLine(ctx, { points: [550, fixY, 2330, fixY] });
    ctx.fillText('Consignee ', 200, fixY - 120);
    ctx.fillText('Name/名前', 200, fixY - 50);
    ctx.fillText(data?.ImpName || '', 600, fixY - 80);

    br(150);
    ctxLine(ctx, { points: [550, fixY, 2330, fixY] });
    ctx.fillText('Zip/郵便番号', 200, fixY - 60);
    ctx.fillText(data?.Zip || '', 600, fixY - 60);

    br(250);
    ctxLine(ctx, { points: [550, fixY, 2330, fixY] });
    ctx.fillText('Address/住所', 200, fixY - 100);
    wrapText(ctx, {
      text: data?.IAD || '',
      x: 600,
      y: fixY - 120,
      maxWidth: 1700,
    });

    br(200);
    ctxLine(ctx, { points: [550, fixY, 2330, fixY] });
    ctx.fillText('Phone No.', 200, fixY - 120);
    ctx.fillText('/電話番号', 200, fixY - 50);
    ctx.fillText(data?.Tel || '', 600, fixY - 80);

    // 右列背景
    ctx.fillStyle = '#fafafa';
    ctx.rect(1450, fixY, 400, 300);
    ctx.fill();
    ctx.fillStyle = 'black';
    ctxLine(ctx, { points: [1450, fixY, 1450, fixY + 300] });
    ctxLine(ctx, { points: [1850, fixY, 1850, fixY + 300] });

    br(250);
    // 左列
    wrapText(ctx, {
      text: data?.CMN || '',
      x: 600,
      y: fixY - 100,
      maxWidth: 750,
    });
    ctx.fillText('Product name', 200, fixY - 140);
    ctx.fillText('name/品名', 200, fixY - 70);
    // 右列
    ctx.fillText('Pcs/個数', 1500, fixY - 160);
    ctx.fillText('Weight/重量', 1500, fixY - 80);
    ctx.fillText('Fare/運賃', 1500, fixY);
    ctx.fillText(data?.PCS?.toString() || '', 1900, fixY - 160);
    ctx.fillText(`${data?.GW || ''} ${data?.GWT || ''}`, 1900, fixY - 80);
    ctx.fillText(`${data?.FR3 || ''} ${data?.FR2 || ''}`, 1900, fixY);

    return [ctx.canvas.toDataURL('image/jpeg', 0.6)];
  } catch (error) {
    message.error('');
    console.log(error);
  }
}

export default renderBL;
