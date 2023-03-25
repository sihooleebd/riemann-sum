import Co from './constant';
import Graph, { LineT } from './Graph';
import RiemannSumGraph from './RiemannSumGraph';

document.addEventListener('DOMContentLoaded', () => {
  new RiemannSum();
});

const colors = ['#000', '#0f0', '#00f', '#f00'];

class RiemannSum {
  constructor() {
    this.test();
  }

  test() {
    const fs = [
      [(x: number) => x, 0.5],
      [(x: number) => x * x, 1 / 3],
      [(x: number) => 1 - x * x, 2 / 3],
      [(x: number) => Math.sqrt(x), 2 / 3],
      [(x: number) => Math.sin(x * Math.PI), 2 / Math.PI],
    ];

    fs.forEach(([f, di]) => {
      this.riemannSum(f, di);
    });
  }

  calcRiemannSum(
    f: (x: number) => number,
    from: number,
    to: number,
    numberOfPartitions: number,
    type: 'left' | 'right' | 'trapezoid',
  ) {
    if (type === 'left') {
      let sum = 0;
      const width = (to - from) / numberOfPartitions;
      for (let k = 1; k <= numberOfPartitions; ++k) {
        const height = f(from + width * (k - 1));
        sum += width * height;
      }
      return sum;
    } else if (type === 'right') {
      let sum = 0;
      const width = (to - from) / numberOfPartitions;
      for (let k = 1; k <= numberOfPartitions; ++k) {
        const height = f(from + width * k);
        sum += width * height;
      }
      return sum;
    }

    return 0;
  }

  riemannSum(f: (x: number) => number, di: number) {
    console.log('riemannSum start');
    // const n = 10;
    // const f = ;
    // const leftSum = this.calcRiemannSum(f, 0, 1, n, 'left');
    // console.log('left sum=', leftSum);
    // const rightSum = this.calcRiemannSum(f, 0, 1, n, 'right');
    // console.log('right sum=', rightSum);

    const partitions = [5, 10, 20, 50];
    const table: number[][] = [];
    partitions.forEach((partition) => {
      console.log('a');
      const leftRiemannSumGraph = new RiemannSumGraph(
        f,
        0,
        1,
        partition,
        'left',
      );
      const leftRiemannSum = leftRiemannSumGraph.getSum();
      const rightRiemannSumGraph = new RiemannSumGraph(
        f,
        0,
        1,
        partition,
        'right',
      );
      const rightRiemannSum = rightRiemannSumGraph.getSum();
      const trapezoidRiemannSumGraph = new RiemannSumGraph(
        f,
        0,
        1,
        partition,
        'trapezoid',
      );
      const trapezoidRiemannSum = trapezoidRiemannSumGraph.getSum();
      table.push([
        di.toFixed(4),
        leftRiemannSum.toFixed(4),
        rightRiemannSum.toFixed(4),
        trapezoidRiemannSum.toFixed(4),
      ]);

      const dataURL = trapezoidRiemannSumGraph.getImage();

      if (dataURL) {
        const img = new Image();
        img.src = dataURL;
        img.width = Co.RIEMANN_GRAPH_WIDTH / 2;
        img.height = Co.RIEMANN_GRAPH_WIDTH / 2;
        document.body.appendChild(img);
        console.log('b');
      } else {
        console.log('no data url');
      }
    });
    //표 넣기
    let str = '';
    for (let i = 0; i < 4; ++i) {
      str += '<tr>';
      for (let j = 0; j < partitions.length; ++j) {
        str += `<td>${table[j][i]}</td>`;
      }
      str += '</tr>';
    }
    const tableElem = document.createElement('table');
    tableElem.innerHTML = str;
    document.body.appendChild(tableElem);
    //표 넣기 끝

    const chart = new Graph(
      Co.GRAPH_WIDTH,
      Co.GRAPH_HEIGHT,
      Co.PADDING,
      0,
      4,
      0,
      1,
    );

    for (let i = 0; i < 4; ++i) {
      const line: LineT = {
        color: colors[i],
        points: partitions.map((p, j) => ({ x: j + 0.1, y: table[j][i] })),
        closed: false,
      };
      chart.addLine(line);
    }
    chart.setTickLabels({ 0.1: '5', 1.1: '10', 2.1: '20', 3.1: '50' }, 'x');
    chart.setTickLabelsFromArray([0.2, 0.4, 0.6, 0.8, 1.0], 'y');
    chart.draw();
    const dataURL = chart.getImage();
    if (dataURL) {
      const img = new Image();
      img.src = dataURL;
      img.width = Co.GRAPH_WIDTH / 2;
      img.height = Co.GRAPH_HEIGHT / 2;
      document.body.appendChild(img);
    }
    const hr = document.createElement('br');
    document.body.appendChild(hr);
  }
}
