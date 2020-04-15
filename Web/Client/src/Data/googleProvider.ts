export const getCircle = () => {
	let circle = '';
	// @ts-ignore
	if (google === undefined) {
		circle = '';
	} else {
		// @ts-ignore
		circle = google.maps.SymbolPath.CIRCLE as string;
	}
	console.log(circle);
	return circle;
};
