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
  Paper,
  Typography,
  InputLabel,
  Select,
  MenuItem,
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
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { cities, most_populous_cities_by_state } from '../Utils/cities';

import { start } from 'repl';
const useStyles = makeStyles((theme: Theme) => ({
  home: {
    textAlign: 'center',
    width: '80%',
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

type CSVData = DSVRowArray | null | any;
const HomePage: React.FC = () => {
  const initialState: CSVData = null;
  const [fetchedStateData, setFetchedStateData] = useState<CSVData>(
    initialState
  );
  const [fetchedTemperatureByDate, setFetchedTemperatureByDate] = useState(
    initialState
  );
  const [fetchedCasesByDate, setFetchedCasesByDate] = useState(initialState);
  const [fetchedCasesByState, setFetchedCasesByState] = useState(initialState);
  const [casesByStateAndRace, setCasesByStateAndRace] = useState(initialState);
  const [deathsByStateAndRace, setDeathsByStateAndRace] = useState(
    initialState
  );
  const [casesByRaceForState, setCasesByRaceForState] = useState(initialState);
  const [deathsByRaceForState, setDeathsByRaceForState] = useState(
    initialState
  );
  const [casesByDateAndRace, setCasesByDateAndRace] = useState(initialState);
  const [deathsByDateAndRace, setDeathsByDateAndRace] = useState(initialState);
  const [dataByState, setDataByState] = useState(initialState);
  const startDate = new Date('04-12-2020');
  const endDate = new Date();
  const [open, setOpen] = React.useState(true);
  const [dateRange, setDateRange] = React.useState<DateRange>({
    startDate,
    endDate,
  });
  const [selectedState, setSelectedState] = React.useState<State | null>(null);
  const [locationValue, setLocationValue] = useState(initialState);

  const getQueryParams = useCallback(() => {
    return `?start_date=${
      dateRange.startDate?.toISOString().split('T')[0]
    }&end_date=${dateRange.endDate?.toISOString().split('T')[0]}`;
  }, [dateRange]);
  const getQueryParams2 = useCallback(() => {
    return `?q=${locationValue}&key=24a9b6b35eb647b487b40156203011&date=${
      dateRange.startDate?.toISOString().split('T')[0]
    }&enddate=${dateRange.endDate?.toISOString().split('T')[0]}`;
  }, [locationValue, dateRange]);
  useEffect(() => {
    console.log('Fetching states...');
    fetch(`/get-states-with-coord-data`).then((res) =>
      res.json().then((data) => {
        setFetchedStateData(data);
      })
    );
  }, []);
  useEffect(() => {
    console.log('Fetching data...');
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
    fetch(`/get-deaths-by-state-and-race${getQueryParams()}`).then((res) =>
      res.json().then((data) => {
        setDeathsByStateAndRace(data);
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
  }, [getQueryParams]);
  useEffect(() => {
    console.log('fetching weather data...');
    fetch(
      `http://api.worldweatheronline.com/premium/v1/past-weather.ashx${getQueryParams2()}&format=json`
    ).then((res) =>
      res.json().then((data) => {
        var dates = [];
        var temperatures = [];
        for (var i = 0; i < data.data.weather.length; i++) {
          dates.push(data.data.weather[i].date);
          temperatures.push(data.data.weather[i].maxtempF);
        }
        var twoLists = { dates: dates, temperatures: temperatures };
        console.log('YAY', twoLists);
        setFetchedTemperatureByDate(twoLists);
      })
    );
  }, [getQueryParams2]);
  useEffect(() => {
    console.log('Fetching data for states...');
    fetch(
      `/get-total-cases-by-date-for-state/${
        selectedState?.abbr
      }${getQueryParams()}`
    ).then((res) =>
      res.json().then((data) => {
        setDataByState(data);
      })
    );
    fetch(
      `/get-cases-by-date-and-race-for-state/${
        selectedState?.abbr
      }${getQueryParams()}`
    ).then((res) =>
      res.json().then((data) => {
        setCasesByRaceForState(data);
      })
    );
    fetch(
      `/get-deaths-by-date-and-race-for-state/${
        selectedState?.abbr
      }${getQueryParams()}`
    ).then((res) =>
      res.json().then((data) => {
        setDeathsByRaceForState(data);
      })
    );
  }, [getQueryParams, selectedState]);

  const classes = useStyles();
  const position: LatLng = new LatLng(41.5, -100.0);
  const toggle = () => {};
  let menuItems1000Cities = [];
  let menuItemsMostPopulousCitiesByState = [];

  console.log('UM fetchedTemperatureByDate:', fetchedTemperatureByDate);

  for (var i = 0; i < cities.length; i++) {
    menuItems1000Cities.push(
      <MenuItem value={cities[i]}>{cities[i]}</MenuItem>
    );
  }

  for (var i = 0; i < most_populous_cities_by_state.length; i++) {
    menuItemsMostPopulousCitiesByState.push(
      <MenuItem value={most_populous_cities_by_state[i]}>
        {most_populous_cities_by_state[i]}
      </MenuItem>
    );
  }

  console.log('locvalue', locationValue);

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
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          margin: '100px',
          alignItems: 'center',
        }}
      >
        <InputLabel id='label'>
          Choose From 1000 Most Populous Cities
        </InputLabel>
        <Select
          labelId='label'
          id='cities'
          onChange={(city) =>
            setLocationValue(String(city.target.value).split(' ').join('+'))
          }
        >
          {menuItems1000Cities}
        </Select>
        <InputLabel id='label'>
          or Choose From Most Populous Cities By State
        </InputLabel>
        <Select
          labelId='label'
          id='cities'
          onChange={(city) =>
            setLocationValue(String(city.target.value).split(' ').join('+'))
          }
        >
          {menuItemsMostPopulousCitiesByState}
        </Select>
      </div>
      <Divider variant='fullWidth' style={{ width: '80%', margin: '10px' }} />
      <Typography variant='h5' style={{ marginTop: '10px' }}>
        US Overview
      </Typography>
      <div style={{ width: '100%' }}>
        <LineGraph
          series={[
            {
              name: 'Temperature (degrees Fahrenheit)',
              data: fetchedTemperatureByDate?.temperatures ?? [],
            },
            {
              name: 'Date',
              data: [],
            },
          ]}
          xaxis={fetchedTemperatureByDate?.dates ?? []}
          title='Temperature by Location'
        />
      </div>
      <div style={{ width: '100%' }}>
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
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
        }}
      >
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
      </div>
      <div style={{ width: '100%' }}>
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
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
        }}
      >
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
        <BarGraph
          series={[
            {
              name: 'Total White Deaths To Date',
              data: deathsByStateAndRace?.white ?? [],
            },
            {
              name: 'Total African-American Deaths To Date',
              data: deathsByStateAndRace?.black ?? [],
            },
            {
              name: 'Total LatinX Deaths To Date',
              data: deathsByStateAndRace?.latino ?? [],
            },
            {
              name: 'Total Multiracial Deaths To Date',
              data: deathsByStateAndRace?.multi ?? [],
            },
          ]}
          xaxis={deathsByStateAndRace?.state ?? []}
          title='Breakdown of Total Deaths by State and Race'
          simple={true}
        />
      </div>
      <Divider variant='fullWidth' style={{ width: '80%', margin: '10px' }} />
      <Typography variant='h5' style={{ marginTop: '10px' }}>
        State Specific Info{selectedState ? `: ${selectedState.name}` : ''}
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
          width: '100%',
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
              zoom={3.5}
              style={{ height: '100%', width: '90%', margin: 'auto' }}
            >
              <TileLayer
                url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                // attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              />
              {/* @ts-ignore */}
              <Markers
                data={fetchedStateData}
                viewMore={(state: State) => {
                  setSelectedState(state);
                }}
              />
            </Map>
          )}
        </div>
      </Paper>
      {selectedState ? (
        <div style={{ width: '100%' }}>
          <Paper
            elevation={1}
            style={{ width: 'fit-content', padding: '10px', margin: 'auto' }}
          >
            <Typography
              variant='h6'
              color='textPrimary'
              style={{ margin: '10px' }}
            >
              {selectedState.name}'s Population:{' '}
              {prettifyNumber(selectedState.population)}
            </Typography>
          </Paper>
          <div style={{ width: '100%' }}>
            <LineGraph
              series={[
                {
                  name: `Total Cases To Date in ${selectedState?.name}`,
                  data: dataByState?.cases ?? [],
                },
                {
                  name: `Total Deaths To Date in ${selectedState?.name}`,
                  data: dataByState?.deaths ?? [],
                },
              ]}
              xaxis={dataByState?.date ?? []}
              title={`Total Cases and Deaths to Date in ${selectedState?.name}`}
            />
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <SimpleLineGraph
              series={[
                {
                  name: `Total White Cases To Date in ${selectedState?.name}`,
                  data: casesByRaceForState?.white ?? [],
                },
                {
                  name: `Total African-American Cases To Date in ${selectedState?.name}`,
                  data: casesByRaceForState?.black ?? [],
                },
                {
                  name: `Total LatinX Cases To Date in ${selectedState?.name}`,
                  data: casesByRaceForState?.latino ?? [],
                },
                {
                  name: `Total Multiracial Cases To Date in ${selectedState?.name}`,
                  data: casesByRaceForState?.multi ?? [],
                },
              ]}
              xaxis={casesByRaceForState?.date ?? []}
              title={`Breakdown of Total Cases by Race in ${selectedState?.name}`}
            />
            <SimpleLineGraph
              series={[
                {
                  name: `Total White Deaths To Date in ${selectedState?.name}`,
                  data: deathsByRaceForState?.white ?? [],
                },
                {
                  name: `Total African-American Deaths To Date in ${selectedState?.name}`,
                  data: deathsByRaceForState?.black ?? [],
                },
                {
                  name: `Total LatinX Deaths To Date in ${selectedState?.name}`,
                  data: deathsByRaceForState?.latino ?? [],
                },
                {
                  name: `Total Multiracial Deaths To Date in ${selectedState?.name}`,
                  data: deathsByRaceForState?.multi ?? [],
                },
              ]}
              xaxis={deathsByRaceForState?.date ?? []}
              title={`Breakdown of Total Deaths by Race in ${selectedState?.name}`}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default HomePage;
