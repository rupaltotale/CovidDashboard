//React Imports
import React, { useEffect, useState } from 'react';
import { csv, DSVRowArray } from 'd3';
import Markers from '../Components/Markers';
/* @ts-ignore */
import LineGraph from '../Components/LineGraph';
import SimpleLineGraph from '../Components/SimpleLineGraph';
//Material UI Imports
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Paper, Typography } from '@material-ui/core';
import { Map, TileLayer } from 'react-leaflet';
import { LatLng } from 'leaflet';
import DateRangePicker from 'react-bootstrap-daterangepicker';
// you will need the css that comes with bootstrap@3. if you are using
// a tool like webpack, you can do the following:
// import 'bootstrap/dist/css/bootstrap.css';
// you will also need the css that comes with bootstrap-daterangepicker
import 'bootstrap-daterangepicker/daterangepicker.css';
import BarGraph from '../Components/BarGraph';
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
  const [casesByDateAndRace, setCasesByDateAndRace] = useState(initialState);
  const [deathsByDateAndRace, setDeathsByDateAndRace] = useState(initialState);

  useEffect(() => {
    fetch('/get-total-cases-by-state').then((res) =>
      res.json().then((data) => {
        setFetchedCasesByState(data);
      })
    );
    fetch('/get-total-cases-by-date').then((res) =>
      res.json().then((data) => {
        setFetchedCasesByDate(data);
      })
    );
    fetch('/get-cases-by-date-and-race').then((res) =>
      res.json().then((data) => {
        setCasesByDateAndRace(data);
      })
    );
    fetch('/get-deaths-by-date-and-race').then((res) =>
      res.json().then((data) => {
        setDeathsByDateAndRace(data);
      })
    );
  }, []);

  if (fetchedStateData == null) {
    csv(`${process.env.PUBLIC_URL}/state-data.csv`).then((res) => {
      setFetchedStateData(res);
    });
  }
  const classes = useStyles();
  const position: LatLng = new LatLng(41.5, -100.0);

  return (
    <div className={classes.home}>
      <DateRangePicker
        initialSettings={{ startDate: '1/1/2014', endDate: '3/1/2014' }}
      >
        <button>Click Me To Open Picker!</button>
      </DateRangePicker>
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
    </div>
  );
};

export default HomePage;
