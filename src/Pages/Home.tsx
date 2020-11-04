//React Imports
import React, { useEffect, useState } from 'react';
import {
  VictoryBar,
  VictoryChart,
  VictoryAxis,
  VictoryGroup,
  VictoryTheme,
  VictoryStack,
  VictoryLine,
  VictoryLabel,
  VictoryZoomContainer,
  VictoryVoronoiContainer,
  VictoryLegend,
} from 'victory';
import { csv, DSVRowArray } from 'd3';

//Material UI Imports
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import { LatLng } from 'leaflet';

const useStyles = makeStyles((theme: Theme) => ({
  home: {
    textAlign: 'center',
    width: '80%',
    margin: 'auto',
  },
  chart: {
    height: '750px',
    width: 'wrap-content',
    margin: 'auto',
  },
  leaflet: {
    height: '400px',
    width: '100%',
    margin: '10px',
  },
}));
const Markers: React.FC = () => {
  const locations = [
    [34.155834, -119.202789],
    [42.933334, -76.566666],
    [42.095554, -79.238609],
    [38.846668, -91.948059],
  ];
  const markers = locations.map((loc: number[]) => {
    return (
      <Marker position={new LatLng(loc[0], loc[1])} key={loc.toString()}>
        <Popup>Major city in the US</Popup>
      </Marker>
    );
  });
  return <div>{markers}</div>;
};
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

type CSVData = DSVRowArray | null;
const HomePage: React.FC = () => {
  const initialState: CSVData = null;
  const [fetchedCSVData, setFetchedCSVdata] = useState<CSVData>(initialState);
  if (fetchedCSVData == null) {
    csv(`${process.env.PUBLIC_URL}/covid-data.csv`).then((res) => {
      setFetchedCSVdata(res);
    });
  }
  const classes = useStyles();
  const position: LatLng = new LatLng(51.505, -0.09);

  return (
    <div className={classes.home}>
      <Typography variant='h3'>COVID Dashboard</Typography>
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
          {fetchedCSVData && (
            <VictoryBar
              horizontal
              data={getTotalCasesPerState(fetchedCSVData)}
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
          {fetchedCSVData && (
            <VictoryGroup
              offset={5}
              colorScale={'qualitative'}
              theme={VictoryTheme.material}
              horizontal
            >
              <VictoryBar
                data={getTotalCasesForEthnicity(fetchedCSVData, 'White')}
                x='state'
                y='total'
              />
              <VictoryBar
                data={getTotalCasesForEthnicity(fetchedCSVData, 'Black')}
                x='state'
                y='total'
              />
              <VictoryBar
                data={getTotalCasesForEthnicity(fetchedCSVData, 'Asian')}
                x='state'
                y='total'
              />
              <VictoryBar
                data={getTotalCasesForEthnicity(fetchedCSVData, 'AIAN')}
                x='state'
                y='total'
              />
            </VictoryGroup>
          )}
        </VictoryChart>
      </div>
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
          {fetchedCSVData && (
            <VictoryBar
              horizontal
              data={getTotalDeathsByState(fetchedCSVData)}
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
          {fetchedCSVData && (
            <VictoryGroup
              offset={5}
              colorScale={'qualitative'}
              theme={VictoryTheme.material}
              horizontal
            >
              <VictoryBar
                data={getTotalDeathsForEthnicity(fetchedCSVData, 'White')}
                x='state'
                y='total'
              />
              <VictoryBar
                data={getTotalDeathsForEthnicity(fetchedCSVData, 'Black')}
                x='state'
                y='total'
              />
              <VictoryBar
                data={getTotalDeathsForEthnicity(fetchedCSVData, 'Asian')}
                x='state'
                y='total'
              />
              <VictoryBar
                data={getTotalDeathsForEthnicity(fetchedCSVData, 'AIAN')}
                x='state'
                y='total'
              />
            </VictoryGroup>
          )}
        </VictoryChart>
      </div>
      {/* <VictoryChart>
        <VictoryLine
          data={[
            { x: 1, y: 2 },
            { x: 2, y: 3 },
            { x: 3, y: 5 },
            { x: 4, y: 4 },
            { x: 5, y: 6 },
          ]}
        />
      </VictoryChart> */}
      <div className={classes.leaflet}>
        <Map center={position} zoom={2} style={{ height: '100%' }}>
          <TileLayer
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          <Markers />
        </Map>
      </div>
    </div>
  );
};

export default HomePage;
