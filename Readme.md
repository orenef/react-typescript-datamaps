# react-typescript-datamaps

react-typescript-datamaps is a react wrapper component for the [datamaps](https://github.com/markmarkoh/datamaps) library - Interactive maps for data visualizations.

Out of the box it includes advance arc-attack-plugin and demo mode.

codesandbox demo -> [Demo]()
## Installation

Use the package manager [npm]() to install .

```bash
npm install 
```
## Out of the box components:
AttackMap - Adding ability to easily disable attacks on svg maps.
DataMapsWrapper - React (with typescript) wrapper for the datamaps library for easy integration in your react project.
handleArcsAdvance - Datamaps plugin, can import alone and add to your own datamaps wrapper.

## Usage

```jsx
// Use example - AttackMap - with builtin demo mode
import React from "react";
import { AttackMap } from "react-typescript-datamaps";

export default function App() {
  return (
	<div className="App">
		<AttackMap demoMode={true}/>
	</div>
  );
}


// Use example - DataMapsWrapper , base on the the India map example https://github.com/markmarkoh/datamaps 

const demoProps = {
	scope: 'india',
			geographyConfig: {
				popupOnHover: true,
				highlightOnHover: true,
				borderColor: '#444',
				borderWidth: 0.5,
				dataUrl: 'https://rawgit.com/Anujarya300/bubble_maps/master/data/geography-data/india.topo.json'
				//dataJson: topoJsonData
			},
			fills: {
				'MAJOR': '#306596',
				'MEDIUM': '#0fa0fa',
				'MINOR': '#bada55',
				defaultFill: '#dddddd'
			},
			data: {
				'JH': { fillKey: 'MINOR' },
				'MH': { fillKey: 'MINOR' }
			},
			setProjection: function () {
				var projection = d3.geo.mercator()
					.center([78.9629, 23.5937]) // always in [East Latitude, North Longitude]
					.scale(1000);
				var path = d3.geo.path().projection(projection);
				return { path: path, projection: projection };
			}
};

let bubblesDemo = [
	{
		centered: "MH",
		fillKey: "MAJOR",
		radius: 20,
		state: "Maharastra"
	},
	{
		centered: "AP",
		fillKey: "MAJOR",
		radius: 22,
		state: "Andhra Pradesh"
	},
	{
		centered: "TN",
		fillKey: "MAJOR",
		radius: 16,
		state: "Tamil Nadu"
	},
	{
		centered: "WB",
		fillKey: "MEDIUM",
		radius: 15,
		state: "West Bengal"
	},
	{
		centered: "MP",
		fillKey: "MEDIUM",
		radius: 15,
		state: "Madhya Pradesh"
	},
	{
		centered: "UP",
		fillKey: "MINOR",
		radius: 8,
		state: "Uttar Pradesh"
	},
	{
		centered: "RJ",
		fillKey: "MINOR",
		radius: 7,
		state: "Rajasthan"
	}
];

export default function App() {
	const [bubbles, setBubbles] = React.useState([]);
	React.useEffect(() => {
		setInterval(() => {
			setBubbles(bubblesDemo);
		}, 4000);
	},[]);
  return (
	<div className="App">
		<DataMapsWrapper
			responsive
			{...demoProps}
			bubbles={bubbles}
		/>
	</div>
  );
}

```

props | type | default value | info
--- | --- | --- | ---
data | ArcItem[] | [] | Array of attacks.
dataMapsProps| undefined or DataMapOptions | undefined | Any props support by the datamaps library
demoMod | boolean | false | Special mode - use to active demo of attacks without server needed.

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](https://choosealicense.com/licenses/mit/)