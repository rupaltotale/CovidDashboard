//React Imports
import React, { useEffect, useState, useCallback } from 'react';
import { csv, DSVRowArray } from 'd3';
import Markers, { State } from '../Components/Markers';
/* @ts-ignore */
import LineGraph from '../Components/LineGraph';
import SimpleLineGraph from '../Components/SimpleLineGraph';
//Material UI Imports
import { makeStyles, Theme } from '@material-ui/core/styles';
import {
  Button,
  Divider,
  IconButton,
  Paper,
  Typography,
} from '@material-ui/core';
import { Map, TileLayer } from 'react-leaflet';
import { LatLng } from 'leaflet';
import BarGraph from '../Components/BarGraph';
import {
  DateRangePicker,
  DateRange,
  DefinedRange,
} from 'materialui-daterange-picker';
import { prettifyNumber } from '../Utils/functions';

import { start } from 'repl';
import Visual from '../Components/Visual';
import { Add } from '@material-ui/icons';
import BarVisual from '../Components/BarVisual';

const useStyles = makeStyles((theme: Theme) => ({
  home: {
    textAlign: 'center',
    width: '90%',
    margin: 'auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chart: {
    height: '500px',
    width: 'wrap-content',
    margin: 'auto',
  },
  leaflet: {
    height: '400px',
    width: '100%',
    margin: '20px',
  },
}));

const LandingPage: React.FC = () => {
  const startDate = new Date('04-12-2020');
  const endDate = new Date();

  const [open, setOpen] = React.useState(true);
  const [dateRange, setDateRange] = React.useState<DateRange>({
    startDate,
    endDate,
  });
  const [counter, setCounter] = React.useState<number>(1);
  const [barCounter, setBarCounter] = React.useState<number>(1);

  const classes = useStyles();
  const position: LatLng = new LatLng(41.5, -100.0);
  const toggle = () => {};
  return (
    <div className={classes.home}>
      <Typography variant='h3' style={{ margin: '15px' }}>
        COVID Dashboard
      </Typography>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          margin: '10px',
          alignItems: 'center',
        }}
      >
        <DateRangePicker
          open={open}
          toggle={toggle}
          onChange={(range) => setDateRange(range)}
          initialDateRange={dateRange}
          // definedRanges={[
          //   { label: 'All Time', startDate: startDate, endDate: endDate },
          // ]}
        />
      </div>

      <Divider variant='fullWidth' style={{ margin: '10px', width: '100%' }} />
      <Button
        variant='outlined'
        color='primary'
        style={{ marginBottom: 10 }}
        onClick={() => setCounter(counter + 1)}
      >
        <Add></Add>
        Add a line graph
      </Button>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {[...Array(counter)].map((c: number) => (
          <Visual key={c} dateRange={dateRange}></Visual>
        ))}
      </div>
      <Divider variant='fullWidth' style={{ margin: '10px', width: '100%' }} />
      <Button
        variant='outlined'
        color='primary'
        style={{ marginBottom: 10 }}
        onClick={() => setBarCounter(barCounter + 1)}
      >
        <Add></Add>
        Add a bar graph
      </Button>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {[...Array(barCounter)].map((c: number) => (
          <BarVisual key={c} dateRange={dateRange}></BarVisual>
        ))}
      </div>
    </div>
  );
};

export default LandingPage;
