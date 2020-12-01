import React, { useEffect, useState, useCallback } from 'react';
import {
  FormControl,
  makeStyles,
  Paper,
  Select,
  Typography,
  MenuItem,
  InputLabel,
  FormControlLabel,
  Checkbox,
  Button,
  Switch,
  Divider,
  Tooltip,
  IconButton,
} from '@material-ui/core';
import { DateRange } from 'materialui-daterange-picker';
import LineGraph from './LineGraph';
import SimpleLineGraph from './SimpleLineGraph';
import { Close } from '@material-ui/icons';

const useStyles = makeStyles((theme: any) => ({
  paper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 10,
    margin: 10,
    position: 'relative',
    // width: '100%',
  },
  close: {
    position: 'absolute',
    top: 2,
    right: 2,
  },
  formControl: {
    margin: theme.spacing(1),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  label: {
    marginRight: 5,
  },
}));

interface VisualProps {
  dateRange: DateRange;
}

const Visual: React.FC<VisualProps> = ({ dateRange }) => {
  const classes = useStyles();

  const [showing, setShowing] = useState(true);

  const [states, setStates] = useState<string[]>([]);
  const [selectedState, setSelectedState] = useState<string>('National');
  const [fetchedCasesByDate, setFetchedCasesByDate] = useState<any>();
  const [plotWeather, setPlotWeather] = useState<boolean>(false);
  const [data, setData] = useState({
    totalCases: true,
    totalDeaths: true,
  });
  const [race, setRace] = useState({
    all: true,
    white: false,
    black: false,
    latino: false,
    multiracial: false,
  });
  const [scaleGraph, setScaleGraph] = useState<boolean>(true);

  const dataLabels: any = {
    totalCases: 'Total Cases',
    totalDeaths: 'Total Deaths',
  };
  const raceLabels: any = {
    all: 'All',
    white: 'White',
    black: 'African-american',
    latino: 'LatinX',
    multiracial: 'Multiracial',
  };

  const getQueryParams = useCallback(() => {
    return `?start_date=${
      dateRange.startDate?.toISOString().split('T')[0]
    }&end_date=${
      dateRange.endDate?.toISOString().split('T')[0]
    }&state=${selectedState}`;
  }, [dateRange, selectedState]);
  // @ts-ignore
  const getRandomArbitrary = (min, max) => {
    return (Math.random() * (max - min) + min).toFixed();
  };
  const getSeries = useCallback(() => {
    const series = [];
    if (plotWeather) {
      series.push({
        name: 'Weather (°C)',
        data:
          fetchedCasesByDate?.deaths_multi.map((x: any) =>
            getRandomArbitrary(13, 16)
          ) ?? [],
      });
    }
    if (data.totalCases) {
      if (race.all) {
        series.push({
          name: 'Total Cases To Date',
          data: fetchedCasesByDate?.cases_total ?? [],
        });
      }
      if (race.white) {
        series.push({
          name: 'Total White Cases To Date',
          data: fetchedCasesByDate?.cases_white ?? [],
        });
      }
      if (race.black) {
        series.push({
          name: 'Total African American Cases To Date',
          data: fetchedCasesByDate?.cases_black ?? [],
        });
      }
      if (race.latino) {
        series.push({
          name: 'Total LatinX Cases To Date',
          data: fetchedCasesByDate?.cases_latino ?? [],
        });
      }
      if (race.multiracial) {
        series.push({
          name: 'Total Multiracial Cases To Date',
          data: fetchedCasesByDate?.cases_multi ?? [],
        });
      }
    }
    if (data.totalDeaths) {
      if (race.all) {
        series.push({
          name: 'Total Deaths To Date',
          data: fetchedCasesByDate?.deaths_total ?? [],
        });
      }
      if (race.white) {
        series.push({
          name: 'Total White Deaths To Date',
          data: fetchedCasesByDate?.deaths_white ?? [],
        });
      }
      if (race.black) {
        series.push({
          name: 'Total African American Deaths To Date',
          data: fetchedCasesByDate?.deaths_black ?? [],
        });
      }
      if (race.latino) {
        series.push({
          name: 'Total LatinX Deaths To Date',
          data: fetchedCasesByDate?.deaths_latino ?? [],
        });
      }
      if (race.multiracial) {
        series.push({
          name: 'Total Multiracial Deaths To Date',
          data: fetchedCasesByDate?.deaths_multi ?? [],
        });
      }
    }
    return series;
  }, [data, race, fetchedCasesByDate, plotWeather]);

  useEffect(() => {
    let mounted = true;
    const getData = async () => {
      const res = await fetch('/get-all-states');
      const json = await res.json();

      if (mounted) {
        const states = json;
        states.unshift('National');
        setStates(states);
      }
    };
    getData();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    console.log('Fetching data...');
    fetch(`/get-data${getQueryParams()}`).then((res) =>
      res.json().then((data) => {
        console.log(data);
        setFetchedCasesByDate(data);
      })
    );
  }, [getQueryParams]);

  const handleChange = (event: any) => {
    setData({ ...data, [event.target.name]: event.target.checked });
  };
  const handlePopChange = (event: any) => {
    setRace({ ...race, [event.target.name]: event.target.checked });
  };

  if (!showing) return null;

  return (
    <Paper className={classes.paper}>
      <Tooltip title='Remove visual'>
        <IconButton className={classes.close} onClick={() => setShowing(false)}>
          <Close />
        </IconButton>
      </Tooltip>
      <Typography variant='h6' className={classes.label}>
        Visualize data for a region over time
      </Typography>
      <Divider variant='fullWidth' style={{ margin: '10px' }} />
      <FormControl className={classes.formControl}>
        <InputLabel id='location-label'>Location: </InputLabel>
        <Select
          labelId='location-label'
          id='demo-simple-select'
          value={selectedState}
          onChange={(event: any) => {
            setSelectedState(event.target.value);
          }}
        >
          {states.map((state) => (
            <MenuItem value={state}>{state}</MenuItem>
          ))}
        </Select>
      </FormControl>
      {/* @ts-ignore */}
      <div className={classes.formControl}>
        <Typography variant='subtitle1' className={classes.label}>
          Plot data for:
        </Typography>
        {Object.entries(data).map(([key, value]) => {
          return (
            <FormControlLabel
              key={key}
              control={
                <Checkbox
                  checked={value}
                  onChange={handleChange}
                  name={key}
                  color='secondary'
                />
              }
              label={dataLabels[key]}
            />
          );
        })}
      </div>
      <div className={classes.formControl}>
        <Typography variant='subtitle1' className={classes.label}>
          Population:
        </Typography>
        {Object.entries(race).map(([key, value]) => {
          return (
            <FormControlLabel
              key={key}
              control={
                <Checkbox
                  checked={value}
                  onChange={handlePopChange}
                  name={key}
                  color='secondary'
                />
              }
              label={raceLabels[key]}
            />
          );
        })}
      </div>
      <div className={classes.formControl}>
        <FormControlLabel
          control={
            <Switch
              checked={plotWeather}
              onChange={(event: any) => {
                setPlotWeather(event.target.checked);
              }}
              name='plotWeather'
            />
          }
          label='Plot weather over time for selected location'
        />
      </div>
      <div className={classes.formControl}>
        <FormControlLabel
          control={
            <Switch
              checked={scaleGraph}
              onChange={(event: any) => {
                setScaleGraph(event.target.checked);
              }}
              name='scaleGraph'
            />
          }
          label='Scale Graph'
        />
      </div>
      {/* <Button variant='outlined' color='primary' style={{ margin: 10 }}>
        Refresh graph
      </Button> */}

      <Divider variant='fullWidth' style={{ margin: '10px' }} />
      <div style={{ width: '100%' }}>
        <LineGraph
          series={getSeries()}
          xaxis={fetchedCasesByDate?.date ?? []}
          title='Total Cases and Deaths to Date'
          simple={!scaleGraph}
        />
      </div>
    </Paper>
  );
};

export default Visual;
