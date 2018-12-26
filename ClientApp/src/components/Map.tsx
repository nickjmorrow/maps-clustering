import * as React from 'react';
import {
	GoogleMap,
	withGoogleMap,
	withScriptjs,
	Marker,
	MarkerProps
} from 'react-google-maps';
import { compose, withProps } from 'recompose';
import { googleMapURL } from '../services';
import { manhattanPosition } from '../constants';

interface Props {
	markers?: MarkerProps[];
	children?: React.ReactNode;
}

export const Map: React.ComponentClass<Props> = compose(
	withProps({
		googleMapURL,
		loadingElement: <div style={{ height: `100%` }} />,
		containerElement: (
			<div style={{ height: `850px`, width: '100%', display: 'block' }} />
		),
		mapElement: <div style={{ height: `100%` }} />
	}),
	withScriptjs,
	withGoogleMap
)((props: Props) => {
	const { markers = [] } = props;
	return (
		<GoogleMap defaultZoom={13} defaultCenter={manhattanPosition}>
			{markers && renderMarkers(markers)}
		</GoogleMap>
	);
});

const renderMarkers = (markers: MarkerProps[]) =>
	markers.map((marker, index) => (
		<Marker
			key={index}
			icon={{
				// @ts-ignore
				fillColor: marker.icon!.fillColor,
				scale: 5,
				path: google.maps.SymbolPath.CIRCLE,
				fillOpacity: 0.9,
				strokeOpacity: 0
			}}
			position={{
				lat: marker.position!.lat as number,
				lng: marker.position!.lng as number
			}}
			label={{ text: marker.label!.text, fontSize: '0' }}
		/>
	));
