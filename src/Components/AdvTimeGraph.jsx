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
        // type: 'datetime',
      },
      // markers: {
      //   size: 1,
      // },
      markers: {
        size: [1, 1],
      },
      yaxis: [
        {
          axisTicks: {
            show: true,
          },
          axisBorder: {
            show: true,
            color: '#FF1654',
          },
          labels: {
            style: {
              colors: '#FF1654',
            },
          },
          title: {
            text: this.props.data[0].name,
            style: {
              color: '#FF1654',
            },
          },
        },
        {
          opposite: true,
          axisTicks: {
            show: true,
          },
          axisBorder: {
            show: true,
            color: '#247BA0',
          },
          labels: {
            style: {
              colors: '#247BA0',
            },
          },
          title: {
            text: this.props.data[1].name,
            style: {
              color: '#247BA0',
            },
          },
        },
      ],
    };
  }
  render() {
    return (
      <Chart
        options={this.getOptions()}
        series={this.props.data}
        type='line'
        width='1500'
      />
    );
  }
}
