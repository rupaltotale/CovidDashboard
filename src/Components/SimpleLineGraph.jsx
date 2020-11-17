import React from 'react';
import Chart from 'react-apexcharts';
import { Paper, Typography } from '@material-ui/core';
import { prettifyNumber } from '../Utils/functions';

export default class SimpleLineGraph extends React.Component {
  getOptions() {
    return {
      chart: {
        id: 'basic-bar',
      },
      xaxis: {
        categories: this.props.xaxis,
      },
      yaxis: {
        labels: {
          formatter: (value) => prettifyNumber(value),
        },
      },
      markers: {
        size: [1, 1],
      },
      tooltip: {
        y: {
          formatter: (value) => prettifyNumber(value),
        },
      },
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
