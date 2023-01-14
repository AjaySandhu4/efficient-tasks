import Component from '@glimmer/component';
import { Course } from '../../../services/firestore';
import { action } from '@ember/object';
import echarts, { ECharts } from 'echarts';

const COURSE_COLORS: string[] = [
  '#C13939',
  '#26bc67',
  '#0471b9',
  '#B61517',
  '#8f7106',
  '#0b6017',
  '#643c0e',
  '#a49d53',
  '#794EA4',
  '#b66713',
];

interface Args {
  course: Course;
  completion: number;
}

export default class CompositionsCoursePieChartComponent extends Component<Args> {
  // Register the required components
  echarts?: ECharts;

  option = {
    series: [
      {
        type: 'pie',
        label: {
          show: false,
        },
        data: [
          {
            value: this.args.completion,
            name: 'Completed',
            itemStyle: { color: COURSE_COLORS[this.args.course.color - 1] },
          },
          {
            value: 100 - this.args.completion,
            name: 'Incomplete',
            itemStyle: { color: 'transparent' },
          },
        ],
        radius: '80%',
        itemStyle: {
          borderWidth: 2,
          borderColor: COURSE_COLORS[this.args.course.color - 1],
        },
      },
    ],
  };
  @action initChart(element: HTMLDivElement): void {
    this.echarts = echarts.init(element) as ECharts;
    this.echarts.setOption(this.option);
    // this.setEchartsOptions()
  }
}
