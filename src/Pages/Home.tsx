//React Imports
import React, { useEffect, useState } from 'react';
import { csv, DSVRowArray } from 'd3';
import Markers from '../Components/Markers';
/* @ts-ignore */
import LineGraph from '../Components/LineGraph';
import SimpleLineGraph from '../Components/SimpleLineGraph';
//Material UI Imports
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Button, Paper, Typography } from '@material-ui/core';
import { Map, TileLayer } from 'react-leaflet';
import { LatLng } from 'leaflet';
// import DateRangePicker from 'react-bootstrap-daterangepicker';
// you will need the css that comes with bootstrap@3. if you are using
// a tool like webpack, you can do the following:
// import 'bootstrap/dist/css/bootstrap.css';
// you will also need the css that comes with bootstrap-daterangepicker
import 'bootstrap-daterangepicker/daterangepicker.css';
import BarGraph from '../Components/BarGraph';
import { DateRangePicker, DateRange } from 'materialui-daterange-picker';

import { start } from 'repl';
const useStyles = makeStyles((theme: Theme) => ({
  home: {
    textAlign: 'center',
    width: '80%',
    margin: 'auto',
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

type CSVData = DSVRowArray | null | any;
const HomePage: React.FC = () => {
  const initialState: CSVData = null;
  const [fetchedStateData, setFetchedStateData] = useState<CSVData>(
    initialState
  );
  const [fetchedCasesByDate, setFetchedCasesByDate] = useState(initialState);
  const [fetchedCasesByState, setFetchedCasesByState] = useState(initialState);
  const [casesByStateAndRace, setCasesByStateAndRace] = useState(initialState);
  const [casesByDateAndRace, setCasesByDateAndRace] = useState(initialState);
  const [deathsByDateAndRace, setDeathsByDateAndRace] = useState(initialState);

  const startDate = new Date('04-12-2020');
  const endDate = new Date();
  const [open, setOpen] = React.useState(true);
  const [dateRange, setDateRange] = React.useState<DateRange>({
    startDate,
    endDate,
  });
  const getQueryParams = () => {
    return `?start_date=${
      dateRange.startDate?.toISOString().split('T')[0]
    }&end_date=${dateRange.endDate?.toISOString().split('T')[0]}`;
  };
  useEffect(() => {
    fetch(`/get-total-cases-by-state${getQueryParams()}`).then((res) =>
      res.json().then((data) => {
        setFetchedCasesByState(data);
      })
    );
    fetch(`/get-cases-by-state-and-race${getQueryParams()}`).then((res) =>
      res.json().then((data) => {
        setCasesByStateAndRace(data);
      })
    );
    fetch(`/get-total-cases-by-date${getQueryParams()}`).then((res) =>
      res.json().then((data) => {
        setFetchedCasesByDate(data);
      })
    );
    fetch(`/get-cases-by-date-and-race${getQueryParams()}`).then((res) =>
      res.json().then((data) => {
        setCasesByDateAndRace(data);
      })
    );
    fetch(`/get-deaths-by-date-and-race${getQueryParams()}`).then((res) =>
      res.json().then((data) => {
        setDeathsByDateAndRace(data);
      })
    );
    // fetch('/get-date-range').then((res) =>
    //   res.json().then((data) => {
    //     console.log(data);
    //     setStartDate(new Date(data.start_date));
    //     setEndDate(new Date(data.end_date));
    //   })
    // );
  }, [dateRange]);

  if (fetchedStateData == null) {
    csv(`${process.env.PUBLIC_URL}/state-data.csv`).then((res) => {
      setFetchedStateData(res);
    });
  }
  const classes = useStyles();
  const position: LatLng = new LatLng(41.5, -100.0);
  const toggle = () => {};
  return (
    <div className={classes.home}>
      <Typography variant='h3' style={{ margin: '15px' }}>
        COVID Dashboard
      </Typography>
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
          Select one of the states on the map for state-specific visualizations
        </Typography>
        <div className={classes.leaflet}>
          {fetchedStateData && (
            <Map
              center={position}
              zoom={3}
              style={{ height: '100%', width: '90%', margin: 'auto' }}
            >
              <TileLayer
                url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              />
              {/* @ts-ignore */}
              <Markers data={fetchedStateData} />
            </Map>
          )}
        </div>
      </Paper>
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
        />
      </div>
      <LineGraph
        series={[
          {
            name: 'Total Cases To Date',
            data: fetchedCasesByDate?.cases ?? [],
          },
          {
            name: 'Total Deaths To Date',
            data: fetchedCasesByDate?.deaths ?? [],
          },
        ]}
        xaxis={fetchedCasesByDate?.date ?? []}
        title='Total Cases and Deaths to Date'
      />
      <SimpleLineGraph
        series={[
          {
            name: 'Total White Cases To Date',
            data: casesByDateAndRace?.white ?? [],
          },
          {
            name: 'Total African-American Cases To Date',
            data: casesByDateAndRace?.black ?? [],
          },
          {
            name: 'Total LatinX Cases To Date',
            data: casesByDateAndRace?.latino ?? [],
          },
          {
            name: 'Total Multiracial Cases To Date',
            data: casesByDateAndRace?.multi ?? [],
          },
        ]}
        xaxis={casesByDateAndRace?.date ?? []}
        title='Breakdown of Total Cases by Race'
      />
      <SimpleLineGraph
        series={[
          {
            name: 'Total White Deaths To Date',
            data: deathsByDateAndRace?.white ?? [],
          },
          {
            name: 'Total African-American Deaths To Date',
            data: deathsByDateAndRace?.black ?? [],
          },
          {
            name: 'Total LatinX Deaths To Date',
            data: deathsByDateAndRace?.latino ?? [],
          },
          {
            name: 'Total Multiracial Deaths To Date',
            data: deathsByDateAndRace?.multi ?? [],
          },
        ]}
        xaxis={deathsByDateAndRace?.date ?? []}
        title='Breakdown of Total Deaths by Race'
      />
      <BarGraph
        series={[
          {
            name: 'Total Cases To Date',
            data: fetchedCasesByState?.cases ?? [],
          },
          {
            name: 'Total Deaths To Date',
            data: fetchedCasesByState?.deaths ?? [],
          },
        ]}
        xaxis={fetchedCasesByState?.state ?? []}
        title='Breakdown of Total Cases and Deaths by State'
      />
      <BarGraph
        series={[
          {
            name: 'Total White Cases To Date',
            data: casesByStateAndRace?.white ?? [],
          },
          {
            name: 'Total African-American Cases To Date',
            data: casesByStateAndRace?.black ?? [],
          },
          {
            name: 'Total LatinX Cases To Date',
            data: casesByStateAndRace?.latino ?? [],
          },
          {
            name: 'Total Multiracial Cases To Date',
            data: casesByStateAndRace?.multi ?? [],
          },
        ]}
        xaxis={casesByStateAndRace?.state ?? []}
        title='Breakdown of Total Cases by State and Race'
        simple={true}
      />
    </div>
  );
};

export default HomePage;
