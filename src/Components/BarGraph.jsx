import React from 'react';
import Chart from 'react-apexcharts';
import { Paper, Typography } from '@material-ui/core';
import { prettifyNumber } from '../Utils/functions';

export default class BarGraph extends React.Component {
  getOptions() {
    const defaultLabels = {
      formatter: (value) => prettifyNumber(value),
    };

    const yaxis = this.props.simple
      ? [
          {
            labels: defaultLabels,
          },
        ]
      : [
          {
            axisTicks: {
              show: true,
            },
            axisBorder: {
              show: true,
              color: '#FF1654',
            },
            labels: {
              ...defaultLabels,
              style: {
                colors: '#FF1654',
              },
            },
            title: {
              text: this.props.series[0].name,
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
              ...defaultLabels,
              style: {
                colors: '#247BA0',
              },
            },
            title: {
              text: this.props.series[1].name,
              style: {
                color: '#247BA0',
              },
            },
          },
        ];
    return {
      chart: {
        id: 'basic-bar',
      },
      xaxis: {
        categories: this.props.xaxis,
      },
      dataLabels: {
        enabled: false,
      },
      tooltip: {
        y: {
          formatter: (value) => prettifyNumber(value),
        },
      },
      yaxis: yaxis,
    };
  }
  render() {
    return (
      <Paper
        elevation={3}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          alignContent: 'center',
          margin: '10px',
          padding: '10px',
          width: '100%',
          height: '750px',
        }}
      >
        <Typography
          variant='h6'
          color='textSecondary'
          style={{ marginBottom: '10px' }}
        >
          {this.props.title}
        </Typography>
        <Chart
          options={this.getOptions()}
          series={this.props.series}
          type='bar'
          width='100%'
          height='80%'
          style={{ width: '100%' }}
        />
      </Paper>
    );
  }
}
