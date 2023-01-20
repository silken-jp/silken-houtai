const Encode: any = {
  '0': '0000011',
  '1': '0000110',
  '2': '0001001',
  '3': '1100000',
  '4': '0010010',
  '5': '1000010',
  '6': '0100001',
  '7': '0100100',
  '8': '0110000',
  '9': '1001000',
  '-': '0001100',
  $: '0011000',
  ':': '1000101',
  '/': '1010001',
  '.': '1010100',
  '+': '0010101',
  A: '0011010',
  B: '0101001',
  C: '0001011',
  D: '0001110',
};

export function codeBar(ctx: CanvasRenderingContext2D, option: any) {
  const {
    code,
    d: [dx, dy, dw, dh],
  } = option;

  const barCode = (code as string).split('').map((str: string) => Encode[str]);

  let gap = 2;
  let shortBar = 2;
  let longBar = 6;
  let vMargin = dy + 10;
  let barHeight = dh;
  let start_x = dx;
  init();
  ctx.fillStyle = 'rgb(0, 0, 0)';
  barCode.forEach((ele) => {
    draw(ele);
  });

  // 依据输出宽度 初始化渲染宽度
  function init() {
    let barCount = 0;
    for (const item of barCode.join('').split('')) {
      if (item === '0') {
        barCount += 2;
      } else {
        barCount += 4;
      }
    }
    gap = shortBar = (1.4 * dw) / barCount;
    longBar = 3 * shortBar;
  }

  // 绘制解码条
  function draw(bstr: string) {
    start_x += gap;
    for (let i = 0; i < bstr.length; i++) {
      let width;
      if (bstr.substring(i, i + 1).startsWith('0')) {
        width = shortBar;
      } else {
        width = longBar;
      }
      if (i % 2 == 0) ctx.fillRect(start_x, vMargin, width, barHeight);
      start_x += width;
    }
  }
}
