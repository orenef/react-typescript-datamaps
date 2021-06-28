import React from 'react';
import d3, { ZoomEvent } from 'd3';
import { DataMapsWrapper } from './DataMapsWrapper';
import { world } from './world';
import { ArcItem } from './ArcPlugin';
import './style.css';

function demoHelper() {
	const tempIndex = (Math.floor(Math.random() * 209));
	const tempIndex2 = (Math.floor(Math.random() * 209));
	const tempIndex3 = (Math.floor(Math.random() * 4));

	const colors = ['green', '#e5a21d', '#e9616d'];

	const origin = {
		latitude: world[tempIndex].latitude,
		longitude:  world[tempIndex].longitude,
		name: world[tempIndex].country
	};
	const destination = {
		latitude: world[tempIndex2].latitude,
		longitude:  world[tempIndex2].longitude,
		name: world[tempIndex2].country
	}
	return { origin, destination, options: {
		destinationCircle: {
			r: 3.5,
			fillColor: colors[tempIndex3],
			strokeColor: colors[tempIndex3]
		},
		arcStrokeColor: colors[tempIndex3],
	}}
}

interface AttackMapProps {
	data?: ArcItem[];
	dataMapsProps?: undefined | DataMapOptions;
	demoMode?: boolean;
}

export const AttackMap: React.FC<AttackMapProps> = ({
	data = [],
	dataMapsProps = undefined,
	demoMode = false
}) => {
	const [arc, setArc] = React.useState(data);
	React.useEffect(() => {
		if (demoMode) {
			setInterval(() => {
				const attack = demoHelper();
				setArc([attack, demoHelper()]);
			}, 4000);
		}
	},[]);
	return (
		<div className="react-map-attack">
		<DataMapsWrapper
			responsive
			attacks={arc}
			geographyConfig={{
				popupOnHover: true,
				highlightOnHover: true,
				highlightFillColor: '#364d53',
				highlightBorderColor: '#364d53',
				borderColor: '#364d53',
				borderWidth: 0.5,
			}}
			fills={{
				defaultFill: '#101518',
			}}
			done={function(datamap: any) {
			  datamap.svg.call(d3.behavior.zoom().on('zoom', zoom));
				  function zoom() {
					datamap.svg.selectAll('g').attr('transform', `translate(${(d3.event as ZoomEvent).translate}) scale(${(d3.event as ZoomEvent).scale})`)
				  }
			  }}
			{...dataMapsProps}
			/>
	  </div>
	);
}
