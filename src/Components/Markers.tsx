import React from 'react';
import { Button } from '@material-ui/core';
import { LatLng } from 'leaflet';
import { Marker, Popup } from 'react-leaflet';

export interface State {
  name: string;
  abbr: string;
  latitude: number;
  longitude: number;
  population: number;
}

interface MarkersProps {
  data: State[];
  viewMore: Function;
}

const Markers: React.FC<MarkersProps> = ({ data, viewMore }) => {
  return (
    <div>
      {data.map((obj: State) => {
        return (
          <Marker
            position={new LatLng(obj.latitude, obj.longitude)}
            key={obj.abbr}
          >
            <Popup>
              <Button variant='contained' onClick={() => viewMore(obj)}>
                View more about {obj.name}
              </Button>
            </Popup>
          </Marker>
        );
      })}
    </div>
  );
};

export default Markers;
