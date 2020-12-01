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
  Switch,
  Divider,
  Chip,
  Tooltip,
  ListItemText,
  IconButton,
} from '@material-ui/core';
import { DateRange } from 'materialui-daterange-picker';
import BarGraph from './BarGraph';
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
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 2,
  },
}));

interface BarVisualProps {
  dateRange: DateRange;
}

const BarVisual: React.FC<BarVisualProps> = ({ dateRange }) => {
  const classes = useStyles();

  const [showing, setShowing] = useState(true);

  const [states, setStates] = useState<string[]>([]);
  const [selectedStates, setSelectedStates] = useState<string[]>([
    'California',
  ]);
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
  const stateMapping = {};

  const getQueryParams = useCallback(() => {
    return `?start_date=${
      dateRange.startDate?.toISOString().split('T')[0]
    }&end_date=${
      dateRange.endDate?.toISOString().split('T')[0]
    }&states=${selectedStates}`;
  }, [dateRange, selectedStates]);

  const getSeries = useCallback(() => {
    const series = [];
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
  }, [data, race, fetchedCasesByDate]);

  useEffect(() => {
    let mounted = true;
    const getData = async () => {
      const res = await fetch('/get-all-states');
      const json = await res.json();

      if (mounted) {
        const states = json;
        // states.unshift('National');
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
    fetch(`/get-data-for-locations${getQueryParams()}`).then((res) =>
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
        Compare cases and deaths for multiple states
      </Typography>
      <Divider variant='fullWidth' style={{ margin: '10px' }} />
      <FormControl className={classes.formControl}>
        <InputLabel id='location-label'>Locations: </InputLabel>
        <Select
          labelId='location-label'
          value={selectedStates}
          onChange={(event: any) => {
            setSelectedStates(event.target.value);
          }}
          multiple
          //@ts-ignore
          renderValue={(selected: string[]) => (
            <div className={classes.chips}>
              {selected.map((value) => (
                <Chip key={value} label={value} className={classes.chip} />
              ))}
            </div>
          )}
        >
          {states.map((state, i) => {
            return (
              <MenuItem key={i} value={state}>
                <Checkbox checked={selectedStates.indexOf(state) > -1} />
                <ListItemText primary={state} />
              </MenuItem>
            );
          })}
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
      {/* <Button variant='outlined' color='primary' style={{ margin: 10 }}>
        Refresh graph
      </Button> */}

      <Divider variant='fullWidth' style={{ margin: '10px' }} />
      <div style={{ width: '100%' }}>
        <BarGraph
          series={getSeries()}
          xaxis={fetchedCasesByDate?.state ?? []}
          title='Breakdown of Total Cases and Deaths by State'
          simple={true}
        />
      </div>
    </Paper>
  );
};

export default BarVisual;
