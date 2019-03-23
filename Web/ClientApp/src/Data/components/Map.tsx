import * as React from "react";
import {
	GoogleMap,
	withGoogleMap,
	withScriptjs,
	Marker,
	MarkerProps
} from "react-google-maps";
import { compose, withProps } from "recompose";
import { googleMapURL } from "../constants";
import { scale } from "../../Core";
import { IPointsGroup } from "Data";

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

export const MapInternal: React.ComponentClass<Props & OtherProps> = compose<
	Props,
	Props & OtherProps
>(
	withProps({
		googleMapURL,
		loadingElement: <div style={{ height: `100%` }} />,
		containerElement: (
			<div style={{ height: "580px", width: "100%", display: "block" }} />
		),
		mapElement: <div style={{ height: `100%` }} />
	}),
	withScriptjs,
	withGoogleMap
)((props: Props & OtherProps) => {
	const { activePointsGroup } = props;

	if (!activePointsGroup) {
		console.log(props);
		return <div>'No active points group'</div>;
	}

	const defaultPosition = activePointsGroup && {
		lat: activePointsGroup.averageVerticalDisplacement,
		lng: activePointsGroup.averageHorizontalDisplacement
	};

	const markers = getMarkers(activePointsGroup);
	return (
		<GoogleMap defaultZoom={13} defaultCenter={defaultPosition}>
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
			label={{ text: marker.label!.text, fontSize: "0" }}
		/>
	));

const getMarkers = (activePointsGroup: IPointsGroup) => {
	const { clusterCount, pointsColors, points } = activePointsGroup;
	return activePointsGroup.clusteringOutput.clusteredPoints.map(mp => {
		return {
			position: {
				lat: mp.verticalDisplacement,
				lng: mp.horizontalDisplacement
			},
			label: {
				text: mp.name
			},
			icon: {
				fillColor:
					pointsColors[
						mp.clusterSnapshots[points.length - clusterCount]
							.clusterId
					]
			}
		};
	});
};
