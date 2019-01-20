import * as React from 'react';
import {
	GoogleMap,
	withGoogleMap,
	withScriptjs,
	Marker,
	MarkerProps
} from 'react-google-maps';
import { compose, withProps } from 'recompose';
import { googleMapURL } from '../../services';
import { scale } from '../../constants';

interface Props {
	markers?: MarkerProps[];
	defaultPosition?: {
		lat: number;
		lng: number;
	};
	center?: {
		lat: number;
		lng: number;
	};
	children?: React.ReactNode;
}

export const Map: React.ComponentClass<Props> = compose(
	withProps({
		googleMapURL,
		loadingElement: <div style={{ height: `100%` }} />,
		containerElement: (
			<div style={{ height: '580px', width: '100%', display: 'block' }} />
		),
		mapElement: <div style={{ height: `100%` }} />
	}),
	withScriptjs,
	withGoogleMap
)((props: Props) => {
	const { markers, defaultPosition, center = defaultPosition } = props;
	return (
		// TODO: defaultCenter should be calculated on the fly based on
		// points chosen
		<GoogleMap
			defaultZoom={13}
			defaultCenter={defaultPosition}
			center={center}>
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
				scale,
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
