export interface ArcItem {
	origin: Location;
	destination: Location;
	options: Options;
}

export interface Location {
	latitude: string | number;
	longitude: string | number;
	name: string;
}

interface Options {
	arcStrokeColor?: string;
	arcStrokeWidth?: number;
	arcSharpness?: number;
	arcLabels?: LabelOptions;
	destinationCircle?: CircleOptions;
}

interface LabelOptions {
	fontSize?: number;
	fontFamily?: string;
	fill?: string;
	strokeColor?: string;
	fillColor?: string;
	
}

interface CircleOptions {
	r?: number;
	fillColor?: string;
	strokeColor?: string;
}

export function handleArcsAdvance(this: any, layer: any, data: ArcItem[], options: any) {
	const self = this as any;

	let defaultOptions = {
		arcLabels : {
			fontSize: 12,
			fontFamily: 'monospace',
			fill: '#fefefe0',
			strokeColor: '#fefefe',
			fillKey: '#a90300'
		},
		destinationCircle: {
			r: 3.5,
			fillColor: '#a90300',
			strokeColor: '#a90300'
		},
		arcStrokeColor: '#a90300',
		arcStrokeWidth: 1.5,
		arcSharpness: 0.8,
		...options
	};
	

	const arcs = layer.selectAll('path.datamaps-arc').data( data, JSON.stringify );
	const enter = arcs.enter();

	/**
	 * Adding origin label
	 */
	enter.append("text")
	.attr('x', function(arc: ArcItem) {
		return self.latLngToXY(arc.origin.latitude, arc.origin.longitude)[0] - 12;
	})
	.attr('y', function(arc: ArcItem) {
		return self.latLngToXY(arc.origin.latitude, arc.origin.longitude)[1] + 10;
	})
	.style('font-size', function(arc: ArcItem) {
		return arc.options?.arcLabels?.fontSize || defaultOptions.arcLabels.fontSize
	})
	.style('font-family', function(arc: ArcItem) {
		return arc.options?.arcLabels?.fontFamily || defaultOptions.arcLabels.fontFamily
	})
	.style('fill', function(arc: ArcItem) {
		return arc.options?.arcLabels?.fill || defaultOptions.arcLabels.fill
	})
	.style('stroke', function(arc: ArcItem) {
		return arc.options?.arcLabels?.strokeColor || defaultOptions.arcLabels.strokeColor
	})
	.text(function(arc: ArcItem) {
		return arc.origin.name;
	})
	.transition()
	.delay(2000)
	.style('opacity', 0)
	.remove();

	/**
	 * Adding destination label
	 */
	enter.append("text")
	.attr('x', function(arc: ArcItem) {
		return self.latLngToXY(arc.destination.latitude, arc.destination.longitude)[0] - 12;
	})
	.attr('y', function(arc: ArcItem) {
		return self.latLngToXY(arc.destination.latitude, arc.destination.longitude)[1] + 10;
	})
	.style('font-size', function(arc: ArcItem) {
		return arc.options?.arcLabels?.fontSize || defaultOptions.arcLabels.fontSize
	})
	.style('font-family', function(arc: ArcItem) {
		return arc.options?.arcLabels?.fontFamily || defaultOptions.arcLabels.fontFamily
	})
	.style('fill', function(arc: ArcItem) {
		return arc.options?.arcLabels?.fill || defaultOptions.arcLabels.fill
	})
	.style('stroke', function(arc: ArcItem) {
		return arc.options?.arcLabels?.strokeColor || defaultOptions.arcLabels.strokeColor
	})
	.transition()
	.delay(500)
	.text(function(arc: ArcItem) {
		return arc.destination.name;
	})
	.transition()
	.delay(2000)
	.style('opacity', 0)
	.remove();

	enter.append('circle')
		.transition()
		  .delay(700)
		.attr('cx', function(arc: ArcItem) {
			return self.latLngToXY(arc.destination.latitude, arc.destination.longitude)[0];

		})
		.attr('cy', function(arc: ArcItem) {
			return self.latLngToXY(arc.destination.latitude, arc.destination.longitude)[1];
		})
		.attr('r', function(arc: ArcItem){
			return arc?.options?.destinationCircle?.r || defaultOptions?.destinationCircle?.r;
		})
		.style('fill', function(arc: ArcItem) {
			return arc?.options?.destinationCircle?.fillColor || defaultOptions?.destinationCircle?.fillColor;
		})
		.style('fill-opacity', 0.6)
		.style('stroke', function(arc: ArcItem) {
			return arc?.options?.destinationCircle?.strokeColor || defaultOptions?.destinationCircle?.strokeColor;
		})
		.transition()
		.duration(250)
		.style("stroke-width", 0)
		.style('stroke-opacity', 0.2)
		.transition()
		.duration(250)
		.style("stroke-width", 0)
		.style('stroke-opacity', 0.5)
		.transition()
		.duration(2000)
		.style("stroke-width", 25)
		.style('stroke-opacity', 0)
		.style('fill-opacity', 1e-6)
		.ease(Math.sqrt)
		.remove();

	/**
	 * Adding arc label
	 */
	enter.append('svg:path')
		.attr('class', 'datamaps-arc')
		.style('stroke-linecap', 'round')
		.style('stroke', function(arc: ArcItem) {
			return arc?.options?.arcStrokeColor || defaultOptions.arcStrokeColor
		})
		.style('fill', 'none')
		.style('stroke-width', function(arc: ArcItem) {
			return arc?.options?.arcStrokeWidth || defaultOptions.arcStrokeWidth
		})
		.attr('d', function(arc: ArcItem) {
			const originXY = self.latLngToXY(arc.origin.latitude, arc.origin.longitude);
			const destXY = self.latLngToXY(arc.destination.latitude, arc.destination.longitude);
			const midXY = [ (originXY[0] + destXY[0]) / 2, (originXY[1] + destXY[1]) / 2];
			return "M" + originXY[0] + ',' + originXY[1] + "S" + (midXY[0] + (50 * options.arcSharpness)) + "," + (midXY[1] - (75 * options.arcSharpness)) + "," + destXY[0] + "," + destXY[1];
		})
		.transition()
		  .delay(100)
		  .style('fill', function(this: any) {
			/*
			  Thank you Jake Archibald, this is awesome.
			  Source: http://jakearchibald.com/2013/animated-line-drawing-svg/
			*/
			// const item = nodes[index];
			const length = this.getTotalLength();
			this.style.transition = this.style.WebkitTransition = 'none';
			this.style.strokeDasharray = length + ' ' + length;
			this.style.strokeDashoffset = length;
			this.getBoundingClientRect();
			this.style.transition = this.style.WebkitTransition = 'stroke-dashoffset ' + options.animationSpeed + 'ms ease-out';
			this.style.strokeDashoffset = '0';
			return 'none';
		  })
		.transition()
		.delay(2000)
		.style('opacity', 0)
		.remove();

	arcs.exit()
	  .transition()
	  .style('opacity', 0)
	  .remove();
  }
