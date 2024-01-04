import dayjs from 'dayjs';
import { message } from 'antd';

import { ctxLine, wrapText, wrapTextCount } from './utils';
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
    const arr = res?.waybillhscodes || [];

    let resData: any[][] = [];
    let tempArr: any[] = [];
    let tempCount = 0;
    let lineMax = 20;
    for (let index = 0; index < arr?.length; index++) {
      const element = arr?.[index];
      const lineCount = wrapTextCount(ctx, {
        text: element?.CMN || '',
        maxWidth: 700,
      });
      console.log(element?.CMN, lineCount);
      tempArr = [...tempArr, element];
      if (tempCount + lineCount > lineMax) {
        resData = [...resData, tempArr];
        tempCount = lineCount;
        tempArr = [];
        lineMax = 25;
      } else {
        tempCount += lineCount;
      }
    }
    resData = [...resData, tempArr];

    return resData.map((_, k) => {
      renderINV2Page(ctx, data, resData, k);
      return ctx.canvas.toDataURL('image/jpeg', 1.0);
    });
  } catch (error) {
    message.error('');
    console.log(error);
  }
}

async function renderINV2Page(
  ctx: CanvasRenderingContext2D,
  data: API.Waybill,
  HScodes: API.HScodes[][],
  idx: number,
) {
  try {
    // api
    let fixY = 0;
    const br = (y?: number) => (fixY += y || 100);
    const DATE = dayjs(data?.DATE).format('MM/DD/YYYY');

    ctx.reset();
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.lineWidth = 2;
    ctx.fillStyle = 'black';
    ctx.strokeStyle = 'black';

    ctx.textAlign = 'left';
    ctx.font = '42px msgothic';
    if (idx === 0) {
      br(200);
      if (data?.IP1 === 'D') {
        ctx.fillText(
          `本件、個人使用の為、${data?._NT1}${data?.IP3} * 0.6 = ${data?.IP4}${data?.IP3} 申告致します。`,
          150,
          fixY,
        );
      } else {
        ctx.fillText(`非個人使用。`, 150, fixY);
      }
    }
    br(200);
    ctx.textAlign = 'center';
    ctx.font = '42px msgothic';
    ctx.fillText(data.HAB, 1240, fixY);
    ctx.textAlign = 'right';
    ctx.fillText(`${idx + 1}/${HScodes.length}`, 2330, fixY);

    br(250);
    ctx.textAlign = 'center';
    ctx.font = 'bold 84px msgothic';
    ctx.fillText('INVOICE', 1240, fixY);
    br();

    if (idx === 0) {
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
    }

    br(50);
    ctx.fillStyle = '#f0f0f0';
    ctx.strokeStyle = '#f0f0f0';
    ctxLine(ctx, { points: [150, fixY, 2330, fixY] });
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
    ctx.fillText('OR', 920, fixY + 65);
    ctx.fillText('HSCODE', 1040, fixY + 65);
    ctx.fillText('QUANTITY', 1470, fixY + 65);
    ctx.fillText('UNIT PRICE', 1740, fixY + 65);
    ctx.fillText('PRICE', 2070, fixY + 65);
    ctx.font = '42px msgothic';

    for (let index = 0; index < HScodes[idx].length; index++) {
      const item = HScodes[idx][index];
      br();
      ctxLine(ctx, { points: [150, fixY, 2330, fixY] });
      const extraH = wrapText(ctx, {
        text: item?.CMN || '',
        x: 170,
        y: fixY + 65,
        maxWidth: 700,
      });
      ctx.fillText(data?.OR || '', 920, fixY + 65 + extraH / 2);
      ctx.fillText(item.CMD, 1040, fixY + 65 + extraH / 2);
      ctx.fillText(
        ` | ${item.tax_rate ? toFixFloor(item.tax_rate, 100) + '%' : 'Free'}`,
        1280,
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

    ctxLine(ctx, { points: [900, tableStartY, 900, fixY + 100] });
    ctxLine(ctx, { points: [1020, tableStartY, 1020, fixY + 100] });
    ctxLine(ctx, { points: [1450, tableStartY, 1450, fixY + 100] });
    ctxLine(ctx, { points: [1720, tableStartY, 1720, fixY + 100] });
    ctxLine(ctx, { points: [2050, tableStartY, 2050, fixY + 100] });

    if (HScodes.length === idx + 1) {
      br();
      ctxLine(ctx, { points: [150, fixY, 2330, fixY] });
      ctx.fillText('TOTAL', 170, fixY + 65);
      ctx.textAlign = 'right';
      ctx.fillText(`${data?.IP3 || ''} ${data?._NT1 || ''}`, 2310, fixY + 65);
    }

    const lineCount = wrapTextCount(ctx, {
      text: HScodes[idx][length - 1]?.CMN || '',
      maxWidth: 700,
    });
    br(lineCount * 100);
    ctxLine(ctx, { points: [150, fixY, 2330, fixY] });
    ctxLine(ctx, { points: [150, tableStartY, 150, fixY] });
    ctxLine(ctx, { points: [2330, tableStartY, 2330, fixY] });
  } catch (error) {
    message.error('');
    console.log(error);
  }
}

export default renderINV2;
