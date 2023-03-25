export type PointT = {
  x: number;
  y: number;
};
export type LineT = {
  points: PointT[];
  color: string;
  closed?: boolean;
};

class Graph {
  width: number;
  height: number;
  padding: number;
  xFrom: number;
  xTo: number;
  yFrom: number;
  yTo: number;

  xAxisTickLabels: Record<number, string | number> = {};
  yAxisTickLabels: Record<number, string | number> = {};

  lines: LineT[] = [];

  canvas: HTMLCanvasElement;

  constructor(
    w: number,
    h: number,
    p: number,
    xf: number,
    xt: number,
    yf: number,
    yt: number,
    canvasId?: string,
  ) {
    this.width = w;
    this.height = h;
    this.padding = p;
    this.xFrom = xf;
    this.xTo = xt;
    this.yFrom = yf;
    this.yTo = yt;

    if (!canvasId) {
      this.canvas = this.createCanvas();
    } else {
      this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
      // console.log('canvas id = ', canvasId);
      // console.log('canvas', this.canvas);
    }
    this.canvas.width = w;
    this.canvas.height = h;
  }

  createCanvas() {
    return document.createElement('canvas');
  }

  addLine(line: LineT) {
    this.lines.push(line);
  }

  setTickLabels(labels: Record<number, string>, axis: 'x' | 'y') {
    if (axis === 'x') {
      this.xAxisTickLabels = labels;
    } else {
      this.yAxisTickLabels = labels;
    }
  }

  setTickLabelsFromArray(labels: number[], axis: 'x' | 'y') {
    const labelsObject: Record<number, string> = {};
    labels.forEach((l) => {
      labelsObject[l] = String(l);
    });
    this.setTickLabels(labelsObject, axis);
  }

  draw() {
    const ctx = this.canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.drawAxis(ctx);

    this.lines.forEach((line) => {
      try {
        this.drawLine(ctx, line);
      } catch (e) {
        console.log('line error', line);
        console.log(e);
      }
    });

    this.writeAxisTickLabels(ctx);
  }

  pointToCanvasPoint(value: number, axis: 'x' | 'y'): number {
    return axis === 'x'
      ? ((value - this.xFrom) / (this.xTo - this.xFrom)) *
          (this.width - 2 * this.padding) +
          this.padding
      : this.height -
          this.padding -
          ((value - this.yFrom) / (this.yTo - this.yFrom)) *
            (this.height - 2 * this.padding);
  }

  moveTo(ctx: CanvasRenderingContext2D, p: PointT) {
    ctx.moveTo(
      this.pointToCanvasPoint(p.x, 'x'),
      this.pointToCanvasPoint(p.y, 'y'),
    );
  }

  lineTo(ctx: CanvasRenderingContext2D, p: PointT) {
    ctx.lineTo(
      this.pointToCanvasPoint(p.x, 'x'),
      this.pointToCanvasPoint(p.y, 'y'),
    );
  }

  drawAxis(ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = '#000';
    ctx.beginPath();

    const xMargin = (this.xTo - this.xFrom) * 0.1;
    const yMargin = (this.yTo - this.yFrom) * 0.1;

    const arrowSize = 10;

    // x축 그리기
    if (this.xFrom <= 0 && this.xTo >= 0) {
      const x = this.pointToCanvasPoint(this.xTo + xMargin, 'x');
      const y = this.pointToCanvasPoint(0, 'y');
      this.moveTo(ctx, { x: this.xFrom - xMargin, y: 0 });
      this.lineTo(ctx, { x: this.xTo + xMargin, y: 0 });
      ctx.lineTo(x - arrowSize, y - arrowSize);
      this.moveTo(ctx, { x: this.xTo + xMargin, y: 0 });
      ctx.lineTo(x - arrowSize, y + arrowSize);
    }
    // y축 그리기
    if (this.yFrom <= 0 && this.yTo >= 0) {
      const x = this.pointToCanvasPoint(0, 'x');
      const y = this.pointToCanvasPoint(this.yTo + yMargin, 'y');
      this.moveTo(ctx, { x: 0, y: this.yFrom - yMargin });
      this.lineTo(ctx, { x: 0, y: this.yTo + yMargin });
      ctx.lineTo(x - arrowSize, y + arrowSize);
      this.moveTo(ctx, { x: 0, y: this.yTo + yMargin });
      ctx.lineTo(x + arrowSize, y + arrowSize);
    }

    ctx.stroke();
  }

  drawLine(ctx: CanvasRenderingContext2D, line: LineT) {
    ctx.strokeStyle = line.color;
    ctx.beginPath();
    ctx.lineWidth = 3;

    if (line.closed) {
      this.moveTo(ctx, line.points.slice(-1)[0]);
    } else {
      // try {
      this.moveTo(ctx, line.points[0]);
      // } catch (e) {
      // console.log('draw line error', line.points);
      // }
    }
    line.points.forEach((point) => {
      this.lineTo(ctx, point);
    });

    ctx.stroke();
  }

  writeAxisTickLabels(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.font = '20px san-serif';
    ctx.fillStyle = '#000';
    ctx.lineWidth = 5;

    // x 축
    ctx.textAlign = 'center';
    Object.keys(this.xAxisTickLabels).forEach((x) => {
      const value = Number(x);
      const label = this.xAxisTickLabels[value];

      // console.log('label', label, ' value', value);

      const xInPx = this.pointToCanvasPoint(value, 'x');
      const yInPx = this.pointToCanvasPoint(0, 'y');

      // console.log('xInPx', xInPx, ' yInPx', yInPx);

      ctx.moveTo(xInPx, yInPx - 3);
      ctx.lineTo(xInPx, yInPx + 3);

      ctx.fillText(`${label}`, xInPx, yInPx + 23);
    });

    // y 축
    ctx.textAlign = 'right';
    Object.keys(this.yAxisTickLabels).forEach((y) => {
      const value = Number(y);
      const label = this.yAxisTickLabels[value];

      // console.log('label', label, ' value', value);

      const xInPx = this.pointToCanvasPoint(0, 'x');
      const yInPx = this.pointToCanvasPoint(value, 'y');

      // console.log('xInPx', xInPx, ' yInPx', yInPx);

      ctx.moveTo(xInPx - 3, yInPx);
      ctx.lineTo(xInPx + 3, yInPx);

      ctx.fillText(`${label}`, xInPx - 10, yInPx + 10);
    });

    ctx.stroke();
    // console.log('x axis tick labels', this.xAxisTickLabels);
  }

  getImage() {
    return this.canvas.toDataURL('image/png');
  }
}

export default Graph;
