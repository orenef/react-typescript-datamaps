import React from 'react';
import Datamaps from 'datamaps';
import { handleArcsAdvance } from './ArcPlugin';

const MAP_CLEARING_PROPS = [
	'height', 'scope', 'setProjection', 'width'
];

interface Props {
	arc?: any[];
	arcOptions?: DataMapArcConfigOptions;
	attacks?: any[];
	bubbleOptions?: DataMapBubblesConfigOptions;
	bubbles?: any;
	data?: any;
	graticule?: boolean;
	height?:  null | number | string;
	labels?: boolean;
	responsive?: boolean;
	style?: any;
	updateChoroplethOptions?: any;
	width?: null | number | string;
	geographyConfig?: DataMapGeographyConfigOptions;
	fills?: any;
	setProjection?: (element: HTMLElement, options: DataMapOptions) => DataMapProjection;
	done?: (datamap: {
        svg: d3.Selection<any>,
        options: DataMapOptions,
        path: d3.geo.Path;
        projection: d3.geo.Projection;
    }) => void;
	restProps?: any
}


const propChangeRequiresMapClear = (oldProps: Props, newProps: Props) => {
	return MAP_CLEARING_PROPS.some((key) =>
		oldProps[key] !== newProps[key]
	);
};

let map: any;

export const DataMapsWrapper: React.FC<Props> = (props) => {
	const containerRef =  React.useRef<HTMLDivElement>(null);
	const prevProps = React.useRef(props);

	const clear = () => {
		const container = containerRef.current;
		if (container) {
			for (const child of Array.from(container.childNodes)) {
				container.removeChild(child);
			}
			map = null;
		}
	}

	const drawMap = () => {
		const {
			arc,
			arcOptions,
			attacks,
			bubbles,
			bubbleOptions,
			data,
			graticule,
			labels,
			updateChoroplethOptions,
			...restProps
		} = props;

		if (!map) {
			map = new Datamaps({
				...restProps,
				data,
				element: containerRef.current,
			});
			map.addPlugin('handleArcsAdvance', handleArcsAdvance);
		} else {
			map.updateChoropleth(data, updateChoroplethOptions);
		}

		if (arc) {
			map.arc(arc, arcOptions);
		}

		if (bubbles) {
			map.bubbles(bubbles, bubbleOptions);
		}

		if (graticule) {
			map.graticule();
		}

		if (labels) {
			map.labels();
		}

		if (attacks) {
			map.handleArcsAdvance(attacks,{
				arcSharpness: 1.4,
				greatArc: true,
				animationSpeed: 600,
			});
		}
	}

	const resizeMap = () => {
		map.resize();
	}

	React.useEffect(() => {
		if (props.responsive) {
			window.addEventListener('resize', resizeMap);
		}
		drawMap();
	},[]);
	React.useEffect(() => {
		if (propChangeRequiresMapClear(prevProps.current, props)) {
			clear();
		}
		prevProps.current = props;
	}, [props]);
	
	React.useEffect(() => {
		drawMap();
	});

	React.useEffect(() => {
		// return a function to execute at unmount
		return () => {
			clear();
			if (props.responsive) {
				window.removeEventListener('resize', resizeMap);
			}	
		}
	}, []);

	return (
		<div ref={containerRef} style={{
			height: '100%',
			position: 'relative',
			width: '100%',
			...props.style
		}} />
	);
}
