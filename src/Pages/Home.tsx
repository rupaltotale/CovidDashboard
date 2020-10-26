//React Imports
import React from 'react';
import {
  VictoryBar,
  VictoryChart,
  VictoryAxis,
  VictoryTheme,
  VictoryStack,
  VictoryLine
} from 'victory';
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
    height: '400px',
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
const HomePage: React.FC = () => {
  const classes = useStyles();
  const data2012 = [
    { quarter: 1, earnings: 13000 },
    { quarter: 2, earnings: 16500 },
    { quarter: 3, earnings: 14250 },
    { quarter: 4, earnings: 19000 },
  ];

  const data2013 = [
    { quarter: 1, earnings: 15000 },
    { quarter: 2, earnings: 12500 },
    { quarter: 3, earnings: 19500 },
    { quarter: 4, earnings: 13000 },
  ];

  const data2014 = [
    { quarter: 1, earnings: 11500 },
    { quarter: 2, earnings: 13250 },
    { quarter: 3, earnings: 20000 },
    { quarter: 4, earnings: 15500 },
  ];

  const data2015 = [
    { quarter: 1, earnings: 18000 },
    { quarter: 2, earnings: 13250 },
    { quarter: 3, earnings: 15000 },
    { quarter: 4, earnings: 12000 },
  ];
  const position: LatLng = new LatLng(51.505, -0.09);

  return (
    <div className={classes.home}>
      <Typography variant='h3'>COVID Dashboard</Typography>
      <div className={classes.chart}>
        <VictoryChart domainPadding={20} theme={VictoryTheme.material}>
          <VictoryAxis
            tickValues={[1, 2, 3, 4]}
            tickFormat={['Quarter 1', 'Quarter 2', 'Quarter 3', 'Quarter 4']}
          />
          <VictoryAxis dependentAxis tickFormat={(x) => `$${x / 1000}k`} />
          <VictoryStack colorScale={'warm'}>
            <VictoryBar data={data2012} x='quarter' y='earnings' />
            <VictoryBar data={data2013} x='quarter' y='earnings' />
            <VictoryBar data={data2014} x='quarter' y='earnings' />
            <VictoryBar data={data2015} x='quarter' y='earnings' />
          </VictoryStack>
        </VictoryChart>
      </div>
      <VictoryChart>
          <VictoryLine
            data={[
              { x: 1, y: 2 },
              { x: 2, y: 3 },
              { x: 3, y: 5 },
              { x: 4, y: 4 },
              { x: 5, y: 6 }
            ]}
          />
        </VictoryChart>
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
