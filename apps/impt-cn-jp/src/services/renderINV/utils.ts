export function wrapText(
  ctx: CanvasRenderingContext2D,
  opt: {
    text: string;
    x?: number;
    y?: number;
    maxWidth: number;
    lineHeight?: number;
    is_count?: boolean;
  },
) {
  let {
    text = '',
    x = 0,
    y = 0,
    maxWidth = 0,
    lineHeight = 50,
    is_count = false,
  } = opt;
  // 字符分隔为数组
  const arrText = text.split(' ');
  let line = '';
  let height = 0;

  for (let n = 0; n < arrText.length; n++) {
    const testLine = line + arrText[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      !is_count && ctx.fillText(line, x, y);
      line = arrText[n] + ' ';
      y += lineHeight;
      height += lineHeight;
    } else {
      line = testLine;
    }
  }
  !is_count && ctx.fillText(line, x, y);
  return height;
}

export function wrapTextCount(
  ctx: CanvasRenderingContext2D,
  opt: {
    text: string;
    maxWidth: number;
    lineHeight?: number;
  },
) {
  let { text = '', maxWidth = 0 } = opt;
  // 字符分隔为数组
  const arrText = text.split(' ');
  let line = '';
  let count = 1;

  for (let n = 0; n < arrText.length; n++) {
    const testLine = line + arrText[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      line = arrText[n] + ' ';
      count++;
    } else {
      line = testLine;
    }
  }
  return count;
}

export function ctxLine(
  ctx: CanvasRenderingContext2D,
  opt: {
    points: number[];
  },
) {
  const { points } = opt;
  ctx.strokeStyle = '#eee';
  ctx.beginPath();
  ctx.moveTo(points[0], points[1]);
  ctx.lineTo(points[2], points[3]);
  ctx.stroke();
  ctx.strokeStyle = 'black';
}

export function ctxVerticalText(
  ctx: CanvasRenderingContext2D,
  opt: {
    name: string;
    point: number[];
    letterSpacing: number;
  },
) {
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
