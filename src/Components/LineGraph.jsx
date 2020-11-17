import { Paper, Typography } from '@material-ui/core';
import React from 'react';
import Chart from 'react-apexcharts';
import { prettifyNumber } from '../Utils/functions';

export default class LineGraph extends React.Component {
  getOptions() {
    const defaultLabels = {
      formatter: (value) => prettifyNumber(value),
    };
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
      tooltip: {
        y: {
          formatter: (value) => prettifyNumber(value),
        },
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
      ],
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
        }}
      >
        <Typography
          variant='h6'
          color='textSecondary'
          style={{ marginTop: '10px' }}
        >
          {this.props.title}
        </Typography>
        <Chart
          options={this.getOptions()}
          series={this.props.series}
          type='line'
          width='1000'
        />
      </Paper>
    );
  }
}
