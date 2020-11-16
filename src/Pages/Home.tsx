//React Imports
import React, { useEffect, useState } from 'react';
import {
  VictoryBar,
  VictoryChart,
  VictoryGroup,
  VictoryTheme,
  VictoryLabel,
  VictoryZoomContainer,
  VictoryVoronoiContainer,
} from 'victory';
import { csv, DSVRowArray } from 'd3';
import Markers, { State } from '../Components/Markers';
/* @ts-ignore */
import TimeGraph from '../Components/TimeGraph';
import AdvTimeGraph from '../Components/AdvTimeGraph';
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

const getTotalDeathsByState = (data: any) => {
  const newData = data
    .slice(0, 51)
    .map((row: any) => {
      if (!isNaN(parseInt(row.Deaths_Total))) {
        return { state: row.State, total: parseInt(row.Deaths_Total) / 1000 };
      }
      return { state: row.State, total: 0 };
    })
    .sort((a: any, b: any) => b.total - a.total)
    .slice(0, 10);
  return newData;
};
const getTotalCasesPerState = (data: any) => {
  const newData = data
    .slice(0, 51)
    .map((row: any) => {
      if (!isNaN(parseInt(row.Cases_Total))) {
        return { state: row.State, total: parseInt(row.Cases_Total) / 1000 };
      }
      return { state: row.State, total: 0 };
    })
    .sort((a: any, b: any) => b.total - a.total)
    .slice(0, 10);
  return newData;
};

const getTotalCasesForEthnicity = (data: any, ethnicity: any) => {
  const newData = data
    .slice(0, 51)
    .sort((a: any, b: any) => b.Cases_Total - a.Cases_Total)
    .slice(0, 10)
    .map((row: any) => {
      if (!isNaN(parseInt(row[`Cases_${ethnicity}`]))) {
        return {
          state: row.State,
          total: parseInt(row[`Cases_${ethnicity}`]) / 1000,
        };
      }
      return { state: row.State, total: 0 };
    });
  return newData;
};

const getTotalDeathsForEthnicity = (data: any, ethnicity: any) => {
  const newData = data
    .slice(0, 51)
    .sort((a: any, b: any) => b.Cases_Total - a.Cases_Total)
    .slice(0, 10)
    .map((row: any) => {
      if (!isNaN(parseInt(row[`Deaths_${ethnicity}`]))) {
        return {
          state: row.State,
          total: parseInt(row[`Deaths_${ethnicity}`]) / 1000,
        };
      }
      return { state: row.State, total: 0 };
    });
  return newData;
};
type CSVData = DSVRowArray | null | any;
const HomePage: React.FC = () => {
  const initialState: CSVData = null;
  const [fetchedCovidData, setFetchedCovidData] = useState<CSVData>(
    initialState
  );
  const [fetchedStateData, setFetchedStateData] = useState<CSVData>(
    initialState
  );
  const [fetchedCasesByDate, setFetchedCasesByDate] = useState<CSVData>(
    initialState
  );

  useEffect(() => {
    fetch('/get-total-cases-by-date').then((res) =>
      res.json().then((data) => {
        console.log(data);
        setFetchedCasesByDate(data);
      })
    );
  }, []);

  if (fetchedCovidData == null) {
    csv(`${process.env.PUBLIC_URL}/covid-data.csv`).then((res) => {
      setFetchedCovidData(res);
    });
  }
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
      <Paper style={{ marginBottom: '10px' }}>
        <Typography
          variant='h6'
          color='textSecondary'
          style={{ marginTop: '20px' }}
        >
          Overview of COVID cases
        </Typography>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Paper style={{ margin: '10px', width: '50%' }} variant='outlined'>
            <div className={classes.chart}>
              <VictoryChart
                theme={VictoryTheme.material}
                domainPadding={10}
                containerComponent={
                  <VictoryVoronoiContainer
                    labels={({ datum }) => {
                      return `${datum.xName}, ${datum._y * 1000}`;
                    }}
                  />
                }
              >
                <VictoryLabel
                  x={25}
                  y={24}
                  text='Number of total cases for top ten states (x 1000)'
                />
                {fetchedCovidData && (
                  <VictoryBar
                    horizontal
                    data={getTotalCasesPerState(fetchedCovidData)}
                    x='state'
                    y='total'
                  ></VictoryBar>
                )}
              </VictoryChart>
            </div>
            <div className={classes.chart}>
              <VictoryChart
                domainPadding={20}
                theme={VictoryTheme.material}
                containerComponent={
                  <VictoryZoomContainer minimumZoom={{ x: 1, y: 10 }} />
                }
              >
                <VictoryLabel
                  x={25}
                  y={24}
                  text='Breakdown of total cases by race for top ten states (x 1000)'
                />
                {fetchedCovidData && (
                  <VictoryGroup
                    offset={5}
                    colorScale={'qualitative'}
                    theme={VictoryTheme.material}
                    horizontal
                  >
                    <VictoryBar
                      data={getTotalCasesForEthnicity(
                        fetchedCovidData,
                        'White'
                      )}
                      x='state'
                      y='total'
                    />
                    <VictoryBar
                      data={getTotalCasesForEthnicity(
                        fetchedCovidData,
                        'Black'
                      )}
                      x='state'
                      y='total'
                    />
                    <VictoryBar
                      data={getTotalCasesForEthnicity(
                        fetchedCovidData,
                        'Asian'
                      )}
                      x='state'
                      y='total'
                    />
                    <VictoryBar
                      data={getTotalCasesForEthnicity(fetchedCovidData, 'AIAN')}
                      x='state'
                      y='total'
                    />
                  </VictoryGroup>
                )}
              </VictoryChart>
            </div>
          </Paper>
          <Paper style={{ margin: '10px', width: '50%' }} variant='outlined'>
            <div className={classes.chart}>
              <VictoryChart
                theme={VictoryTheme.material}
                domainPadding={10}
                containerComponent={
                  <VictoryVoronoiContainer
                    labels={({ datum }) => {
                      return `${datum.xName}, ${datum._y * 1000}`;
                    }}
                  />
                }
              >
                <VictoryLabel
                  x={25}
                  y={24}
                  text='Number of total deaths for top ten states (x 1000)'
                />
                {fetchedCovidData && (
                  <VictoryBar
                    horizontal
                    data={getTotalDeathsByState(fetchedCovidData)}
                    x='state'
                    y='total'
                  ></VictoryBar>
                )}
              </VictoryChart>
            </div>

            <div className={classes.chart}>
              <VictoryChart
                domainPadding={20}
                theme={VictoryTheme.material}
                containerComponent={
                  <VictoryZoomContainer minimumZoom={{ x: 1, y: 10 }} />
                }
              >
                <VictoryLabel
                  x={25}
                  y={24}
                  text='Breakdown of total deaths by race for top ten states (x 1000)'
                />
                {fetchedCovidData && (
                  <VictoryGroup
                    offset={5}
                    colorScale={'qualitative'}
                    theme={VictoryTheme.material}
                    horizontal
                  >
                    <VictoryBar
                      data={getTotalDeathsForEthnicity(
                        fetchedCovidData,
                        'White'
                      )}
                      x='state'
                      y='total'
                    />
                    <VictoryBar
                      data={getTotalDeathsForEthnicity(
                        fetchedCovidData,
                        'Black'
                      )}
                      x='state'
                      y='total'
                    />
                    <VictoryBar
                      data={getTotalDeathsForEthnicity(
                        fetchedCovidData,
                        'Asian'
                      )}
                      x='state'
                      y='total'
                    />
                    <VictoryBar
                      data={getTotalDeathsForEthnicity(
                        fetchedCovidData,
                        'AIAN'
                      )}
                      x='state'
                      y='total'
                    />
                  </VictoryGroup>
                )}
              </VictoryChart>
            </div>
          </Paper>
        </div>
      </Paper>
      <AdvTimeGraph
        series={fetchedCasesByDate?.cases}
        data={[
          { name: 'Total Cases To Date', data: fetchedCasesByDate?.cases },
          { name: 'Total Deaths To Date', data: fetchedCasesByDate?.deaths },
        ]}
        xaxis={fetchedCasesByDate?.date}
      />
    </div>
  );
};

export default HomePage;
