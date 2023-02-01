import { codeBar } from './codeBar';

function renderEDIPrint(
  ctx: CanvasRenderingContext2D,
  data: API.Waybill[],
  page: string,
) {
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'black';
  ctx.font = '32px msgothic';
  ctx.strokeRect(1, 1, 1000, 1500);

  for (let index = 0; index < 6; index++) {
    const element = data[index];
    if (!element) break;
    const h = 50 + index * 240;
    codeBar(ctx, {
      code: `D${element.HAB}D`,
      d: [100, h, 350, 115],
    });
    ctx.fillText(`D${element.HAB}D`, 130, h + 160);
  }
  for (let index = 6; index < 12; index++) {
    const element = data[index];
    if (!element) break;
    const h = 50 + (index - 6) * 240;
    codeBar(ctx, {
      code: `D${element.HAB}D`,
      d: [550, h, 350, 115],
    });
    ctx.fillText(`D${element.HAB}D`, 580, h + 160);
  }
  ctx.fillText(page, 490, 1480);
}

export default renderEDIPrint;
