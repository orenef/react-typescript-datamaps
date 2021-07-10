import React from 'react';
import d3, { ZoomEvent } from 'd3';
import { DataMapsWrapper } from './DataMapsWrapper';
import { AttackTicker } from './AttackTicker';
import { world, cyberThreats } from './world';
import { ArcItem } from './ArcPlugin';
import './style.css';

function demoHelper() {
	const tempIndex = (Math.floor(Math.random() * 205));
	const tempIndex2 = (Math.floor(Math.random() * 205));
	const tempIndex3 = (Math.floor(Math.random() * 3));
	const threat = cyberThreats[tempIndex3];

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
	return { origin, destination, type: threat.name, color: threat.color, options: {
		destinationCircle: {
			r: 3.5,
			fillColor: threat.color,
			strokeColor: threat.color
		},
		arcStrokeColor: threat.color,
	}}
}

interface AttackMapProps {
	data?: ArcItem[];
	dataMapsProps?: undefined | SlimDataMapOptions;
	demoMode?: boolean;
	hideTicker?: boolean;
}

interface SlimDataMapOptions {
    scope?: string;
    geographyConfig?: DataMapGeographyConfigOptions;
    bubblesConfig?: DataMapBubblesConfigOptions;
    arcConfig?: DataMapArcConfigOptions;
    setProjection?: (element: HTMLElement, options: DataMapOptions) => DataMapProjection;
    fills?: any;
    done?: (datamap: {
        svg: d3.Selection<any>,
        options: DataMapOptions,
        path: d3.geo.Path;
        projection: d3.geo.Projection;
    }) => void;
    responsive?: boolean;
    projection?: string;
    height?: null | number;
    width?: null | number;
    dataType?: "json" | "csv";
    dataUrl?: null | string;
    data?: any;
    filters?: any;
    aspectRatio?: number;
    projectionConfig?: { rotation: any[] };
}

export const AttackMap: React.FC<AttackMapProps> = ({
	data = [],
	dataMapsProps = undefined,
	demoMode = false,
	hideTicker = true,
}) => {
	const [arc, setArc] = React.useState(data);
	const [items, setItems] = React.useState<any>([]);
	React.useEffect(() => {
		if (demoMode) {
			setInterval(() => {
				const attack = demoHelper();
				setArc([attack]);
				setItems([{
					id: Math.random().toString(),
					origin: attack.origin.name,
					destination: attack.destination.name,
					type: attack.type,
					color: attack.color
				}]);
			}, 4000);
		}
	},[]);
	const wrapperStyle = dataMapsProps && dataMapsProps.width ? { width: `${dataMapsProps.width}px`, height: `${dataMapsProps.height}px` } : {};
	const tickerStyle =  dataMapsProps && dataMapsProps.width ? { width: `${dataMapsProps.width}px` } : {};
	return (
		<div className="react-map-attack">
			<div className="react-map-attack-wrapper" style={wrapperStyle}>
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
			{!hideTicker && <div className="react-map-ticker-wrapper" style={tickerStyle}>
				<AttackTicker addItems={items}/>
			</div>}
		</div>
	);
}
