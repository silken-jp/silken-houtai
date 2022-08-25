import dayjs from 'dayjs';

import { codeBar } from './codeBar';

function ctxLine(ctx: CanvasRenderingContext2D, opt: any) {
  const { points } = opt;
  ctx.beginPath();
  ctx.moveTo(points[0], points[1]);
  ctx.lineTo(points[2], points[3]);
  ctx.stroke();
}

function ctxVerticalText(ctx: CanvasRenderingContext2D, opt: any) {
  let {
    name = '',
    point: [x = 0, y = 0],
    letterSpacing = 10,
  } = opt;
  for (let i = 0; i < name.length; i++) {
    const str = name.slice(i, i + 1).toString();
    ctx.save();
    ctx.textBaseline = 'top';
    ctx.fillText(str, x, y);
    ctx.restore();
    y += ctx.measureText(str).width + letterSpacing; // 计算文字宽度
  }
}

function ctxEDICode(
  ctx: CanvasRenderingContext2D,
  code1: string,
  code2: string,
) {
  ctx.font = '600 120px msgothic';
  let dx1 = 240 - code1.length * 40;
  let dx2 = dx1 + 30 + code1.length * 15 + ctx.measureText(code1).width;
  ctx.fillText(code1.split('').join(String.fromCharCode(8201)), dx1, 130);
  ctx.font = '500 60px msgothic';
  ctx.fillText(code2.split('').join(String.fromCharCode(8201)), dx2, 130);
}

function receiverFill(ctx: CanvasRenderingContext2D, data: API.Waybill) {
  const { receiver_zip, receiver_add, receiver_tel, ImpNameJP } = data || {};
  const zip = receiver_zip.slice(0, 3) + '-' + receiver_zip.slice(3);
  ctx.font = '30px msgothic';
  ctx.fillText(`〒 ${zip}`, 75, 230);
  if (ctx.measureText(receiver_add).width < 542) {
    ctx.fillText(receiver_add, 75, 270);
    ctx.font = '36px msgothic';
    ctx.fillText(`${ImpNameJP} 様`, 75, 320);
    ctx.font = '30px msgothic';
    ctx.fillText(`TEL ${receiver_tel}`, 75, 370);
  } else {
    let i = receiver_add.length - 1;
    while (ctx.measureText(receiver_add.slice(0, i)).width > 542) {
      i--;
    }
    ctx.fillText(receiver_add.slice(0, i), 75, 270);
    ctx.fillText(receiver_add.slice(i), 75, 310);
    ctx.font = '36px msgothic';
    ctx.fillText(`${ImpNameJP} 様`, 75, 370);
    ctx.font = '30px msgothic';
    ctx.fillText(`TEL ${receiver_tel}`, 75, 430);
  }
}

function renderEDIPrint(ctx: CanvasRenderingContext2D, data: API.Waybill) {
  const {
    EDI_code = {
      arr_code1: '',
      arr_code2: '',
    },
    DATE,
    NO,
  } = data || {};
  const flightDate = dayjs(DATE).format('YYYY/MM/DD');

  ctx.lineWidth = 2;
  ctx.strokeStyle = 'black';
  ctx.font = '32px msgothic';
  ctx.strokeRect(1, 1, 1000, 1500);
  // 1
  ctx.strokeRect(1, 1, 1000, 190);
  ctxLine(ctx, { points: [671, 1, 671, 190] });
  ctxLine(ctx, { points: [671, 51, 1000, 51] });
  ctxLine(ctx, { points: [731, 51, 731, 190] });
  ctxLine(ctx, { points: [731, 140, 1000, 140] });
  ctxLine(ctx, { points: [781, 51, 781, 140] });
  ctxEDICode(ctx, EDI_code?.arr_code1, EDI_code?.arr_code2);
  ctx.font = '32px msgothic';
  ctx.fillText(`発送日: ${flightDate}`, 681, 36);
  ctxVerticalText(ctx, {
    name: '元払',
    point: [686, 80],
  });
  ctxVerticalText(ctx, {
    name: '個数',
    point: [740, 60],
  });
  ctx.fillText(`${NO}`, 870, 110);
  ctx.fillText(`NO${NO}`, 830, 179);
  // 2
  ctx.strokeRect(1, 191, 1000, 270);
  ctxLine(ctx, { points: [61, 191, 61, 461] });
  ctxLine(ctx, { points: [631, 191, 631, 411] });
  ctxLine(ctx, { points: [631, 241, 1000, 241] });
  ctxLine(ctx, { points: [631, 411, 1000, 411] });
  ctxVerticalText(ctx, {
    name: 'お届先',
    point: [15, 270],
  });
  receiverFill(ctx, data);
  ctx.font = '32px msgothic';
  ctx.fillText('着店バーコード', 701, 226);
  codeBar(ctx, {
    code: `C${EDI_code?.arr_code1}${EDI_code?.arr_code2}D`,
    d: [710, 265, 225, 100],
  });

  // 3
  ctx.strokeRect(1, 461, 1000, 250);
  ctxLine(ctx, { points: [1, 521, 437, 521] });
  ctxLine(ctx, { points: [219, 461, 219, 521] });
  ctxLine(ctx, { points: [437, 461, 437, 711] });
  ctxLine(ctx, { points: [497, 461, 497, 711] });
  ctx.font = '36px msgothic';
  ctx.fillText('佐川急便(株)', 11, 503);
  ctx.fillText('東京営業所', 229, 503);
  ctx.fillText('お問合せTEL', 11, 603);
  ctx.fillText('顧客コード', 11, 653);
  ctx.font = '26px msgothic';
  ctx.fillText('0570-01-0349', 231, 603);
  ctx.fillText('151289260001', 201, 653);
  ctx.font = '36px msgothic';
  ctxVerticalText(ctx, {
    name: '問合番号',
    point: [447, 491],
  });
  codeBar(ctx, {
    code: `D${data.HAB}D`,
    d: [587, 510, 350, 115],
  });
  ctx.font = '30px msgothic';
  ctx.fillText(data.HAB, 647, 670);

  // 4
  ctx.strokeRect(1, 711, 1000, 180);
  ctxLine(ctx, { points: [521, 711, 521, 891] });
  ctx.font = '32px msgothic';
  ctxVerticalText(ctx, {
    name: 'ご依頼主',
    point: [15, 721],
  });
  ctxVerticalText(ctx, {
    name: '出荷場',
    point: [535, 741],
  });
  ctx.font = '26px msgothic';
  ctx.fillText('東京都新宿区市谷田町2丁目17', 71, 750);
  ctx.fillText('市谷八重洲匕儿9階', 71, 790);
  ctx.fillText('華南株式会社', 71, 830);
  ctx.fillText('TEL: 03-5579-8595', 71, 870);
  ctx.fillText('東京都足立区南花烟4-28-18', 591, 750);
  ctx.fillText('華南株式会社', 591, 790);
  ctx.fillText('TEL: 03-5851-9290', 591, 830);

  // 5
  ctx.strokeRect(1, 891, 1000, 180);
  ctxLine(ctx, { points: [61, 891, 61, 1071] });
  ctx.font = '32px msgothic';
  ctxVerticalText(ctx, {
    name: '記事欄',
    point: [15, 916],
  });
  ctx.font = '30px msgothic';
  ctx.fillText('EC貨物の返品などは直接購入', 71, 931);
  ctx.fillText('されたECサイトまでお問い合', 71, 981);
  ctx.fillText('わせください。', 71, 1031);
  // 6
  ctx.strokeRect(1, 1071, 1000, 430);
  ctxLine(ctx, { points: [201, 1071, 201, 1500] });
  ctxLine(ctx, { points: [801, 1071, 801, 1500] });
  ctxLine(ctx, { points: [201, 1299, 801, 1299] });
  ctx.font = '30px msgothic';
  ctx.fillText('【陸便】', 205, 1101);
  ctx.fillText('【佐川急便(株) 京都市南区上烏羽角田町 68', 205, 1335);
  ctx.fillText('番地】', 205, 1385);
  ctx.fillText('【佐川急便(株)の損害賠價限度額は荷物1個', 205, 1435);
  ctx.fillText('につき30万円です】', 205, 1485);
  ctx.font = '21px msgothic';
  codeBar(ctx, {
    code: 'D002B',
    d: [15, 1120, 180, 65],
  });
  ctx.fillText('2kg(サイズ 60)', 30, 1220);
  codeBar(ctx, {
    code: 'D005B',
    d: [15, 1230, 180, 65],
  });
  ctx.fillText('5kg(サイズ 80)', 30, 1330);
  codeBar(ctx, {
    code: 'D010B',
    d: [15, 1340, 180, 65],
  });
  ctx.fillText('10kg(サイズ 100)', 20, 1440);
  codeBar(ctx, {
    code: 'D020B',
    d: [815, 1180, 180, 65],
  });
  ctx.fillText('20kg(サイズ 140)', 820, 1280);
  codeBar(ctx, {
    code: 'D030B',
    d: [815, 1300, 180, 65],
  });
  ctx.fillText('30kg(サイズ 160)', 820, 1400);
}

export default renderEDIPrint;
