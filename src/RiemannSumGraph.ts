import Co from './constant';
import Graph, { LineT } from './Graph';
class RiemannSumGraph {
  graph: Graph;
  f: (x: number) => number;
  numberOfPartitions: number;
  type: 'left' | 'right' | 'trapezoid';
  from: number;
  to: number;
  sum = 0;

  constructor(
    f: (x: number) => number,
    from: number,
    to: number,
    numberOfPartitions: number,
    type: 'left' | 'right' | 'trapezoid',
  ) {
    this.f = f;

    this.graph = new Graph(
      Co.GRAPH_WIDTH,
      Co.GRAPH_WIDTH,
      Co.PADDING,
      from,
      to,
      0, // yFrom
      1, // yTo
    );

    this.from = from;
    this.to = to;
    this.numberOfPartitions = numberOfPartitions;
    this.type = type;

    this.crateData();
  }

  crateData() {
    this.sum = 0;
    // 실제 함수
    const numberOfStep = 100;
    const line: LineT = {
      color: '#f00',
      points: [],
    };

    const step = (this.to - this.from) / numberOfStep;
    for (let k = 0; k <= numberOfStep; ++k) {
      const x = this.from + step * k;
      const y = this.f(x);
      line.points.push({ x, y });
    }

    this.graph.addLine(line);

    // 다각형들
    const width = (this.to - this.from) / this.numberOfPartitions;
    for (let k = 1; k <= this.numberOfPartitions; ++k) {
      const polygon: LineT = {
        color: '#888',
        points: [], 
      };
      let heightLeft = 0;
      let heightRight = 0;
      if (this.type === 'left') {
        heightLeft = this.f(this.from + width * (k - 1));
        heightRight = heightLeft;
      } else if (this.type === 'right') {
        heightLeft = this.f(this.from + width * k);
        heightRight = heightLeft;
      } else if (this.type === 'trapezoid') {
        heightLeft = this.f(this.from + width * (k - 1));
        heightRight = this.f(this.from + width * k);
      }
      this.sum += ((heightLeft + heightRight) / 2) * width;
      polygon.points.push({ x: this.from + width * (k - 1), y: 0 });
      polygon.points.push({ x: this.from + width * (k - 1), y: heightLeft });
      polygon.points.push({ x: this.from + width * k, y: heightRight });
      polygon.points.push({ x: this.from + width * k, y: 0 });
      this.graph.addLine(polygon);
      this.graph.setTickLabelsFromArray([0, 0.2, 0.4, 0.6, 0.8, 1], 'x');

      this.graph.setTickLabelsFromArray([0, 0.2, 0.4, 0.6, 0.8, 1], 'y');
    }
  }

  getImage() {
    this.graph.draw();
    return this.graph.getImage();
  }

  getSum() {
    return this.sum;
  }

  /*
function canvasImg(canvas) {
    var ctx = canvas.getContext('2d');
    ctx.fillRect(0,0,canvas.width, canvas.height);
    var img = canvas.toDataURL('image/png');

    return img;
}

function placeImage(canvas, img) {
    var ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0,0);
}

window.onload = function(){
    var canvas = createCanvas(400, 400);
    var hiddenCanvas = createCanvas(400,400);
    var i = canvasImg(hiddenCanvas);
    var img = new Image();
    img.src = i;
    placeImage(canvas, img);
    document.body.appendChild(canvas);
}
*/
}

export default RiemannSumGraph;
