import React from 'react';
import Chart from 'react-apexcharts';

export default class AdvTimeGraph extends React.Component {
  getOptions() {
    return {
      chart: {
        id: 'basic-bar',
      },
      xaxis: {
        categories: this.props.xaxis,
      },
    };
  }
  getSeries() {
    return [
      {
        name: 'series-1',
        data: this.props.series,
      },
      // {
      //   name: 'series-2',
      //   data: [49, 60, 70, 91, 30, 40, 45, 50],
      // },
    ];
  }
  render() {
    return (
      <Chart
        options={this.getOptions()}
        series={this.getSeries()}
        type='line'
        width='1500'
      />
    );
  }
}
