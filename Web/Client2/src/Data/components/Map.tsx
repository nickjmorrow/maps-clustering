import * as React from 'react';
import { GoogleMap, withGoogleMap, withScriptjs, Marker, MarkerProps, Polyline } from 'react-google-maps';
import { compose, withProps } from 'recompose';
import { googleMapURL } from '../constants';
import { scale } from '../../Core';
import { IPointsGroup } from 'Data';
import { getCircle } from 'Data/googleProvider';

interface Props {
	center?: {
		lat: number;
		lng: number;
	};
	children?: React.ReactNode;
	activePointsGroup: IPointsGroup;
}

interface OtherProps {
	activePointsGroup: IPointsGroup;
}

export const Map: React.SFC<OtherProps> = ({ activePointsGroup }) => (
	<MapInternal activePointsGroup={activePointsGroup} />
);

export const MapInternal: React.ComponentClass<Props & OtherProps> = compose<Props, Props & OtherProps>(
	withProps({
		googleMapURL,
		loadingElement: <div style={{ height: '100%', backgroundColor: 'red' }} />,
		containerElement: <div style={{ height: '580px', width: '100%', display: 'block' }} />,
		mapElement: <div style={{ height: '100%' }} />,
	}),
	withScriptjs,
	withGoogleMap,
)((props: Props & OtherProps) => {
	const { activePointsGroup } = props;

	const defaultPosition = activePointsGroup && {
		lat: activePointsGroup.averageVerticalDisplacement,
		lng: activePointsGroup.averageHorizontalDisplacement,
	};

	const markers = getMarkers(activePointsGroup);
	const polylines = getPolylines(activePointsGroup);

	return (
		<GoogleMap defaultZoom={13} defaultCenter={defaultPosition} center={defaultPosition}>
			{markers && renderMarkers(markers)}
			{renderPolylines(polylines)}
		</GoogleMap>
	);
});

type PolylineInfo = Array<{
	lat: number;
	lng: number;
	orderId: number;
}>;

const renderPolylines = (polylineProps: PolylineInfo[]): React.ReactNode => {
	return polylineProps.map((plp, i) => {
		return (
			<Polyline
				key={i}
				path={plp}
				options={{
					geodesic: true,
					strokeColor: '#FF0000',
					strokeOpacity: 1.0,
					strokeWeight: 2,
				}}
			/>
		);
	});
};

const getPolylines = (pointsGroup: IPointsGroup): PolylineInfo[] => {
	const { clusterCount } = pointsGroup;

	// TODO: this type seems wrong
	return pointsGroup.calculationOutput.orderedPoints
		.reduce<PolylineInfo[]>((agg, cur, index, arr) => {
			const { clusterId, orderId } = cur.clusterSnapshots.find(cs => cs.clusterCount === clusterCount)!;
			const latLng = {
				lat: cur.verticalDisplacement,
				lng: cur.horizontalDisplacement,
				orderId,
			};
			if (agg[clusterId]) {
				agg[clusterId].push(latLng);
			} else {
				agg[clusterId] = [latLng];
			}
			return agg;
		}, [])
		.filter(p => p.length > 1)
		.map(p => p.sort(x => x.orderId));
};

const renderMarkers = (markers: MarkerProps[]) =>
	markers.map((marker, index) => (
		<Marker
			key={index}
			icon={{
				// @ts-ignore
				fillColor: marker.icon!.fillColor,
				scale,
				path: getCircle(),
				fillOpacity: 0.9,
				strokeOpacity: 0,
			}}
			position={{
				lat: marker.position!.lat as number,
				lng: marker.position!.lng as number,
			}}
			label={{ text: marker.label!.text, fontSize: '0' }}
		/>
	));

const getMarkers = (activePointsGroup: IPointsGroup) => {
	const {
		clusterCount,
		pointsColors,
		calculationOutput: { orderedPoints: points },
	} = activePointsGroup;

	return activePointsGroup.calculationOutput.orderedPoints.map(mp => {
		return {
			position: {
				lat: mp.verticalDisplacement,
				lng: mp.horizontalDisplacement,
			},
			label: {
				text: mp.name,
			},
			icon: {
				fillColor: pointsColors[mp.clusterSnapshots[points.length - clusterCount].clusterId],
			},
		};
	});
};
