import React from 'react';

interface Props {
	addItems: Item[];
}

interface Item {
	id: string;
	origin: string;
	destination: string;
	type?: string;
	color?: string;
}

const MAX_TABLE_ITEMS = 3;

export const AttackTicker: React.FC<Props> = (props) => {
	const [items, setItems] = React.useState<Item[]>([]);
	React.useEffect(() => {
		if (items.length < MAX_TABLE_ITEMS) {
			setItems(items.concat(props.addItems));
		} else {
			const nextItems = items.concat(props.addItems);
			nextItems.splice(0, props.addItems.length);
			setItems(nextItems);
		}
	},[props.addItems]);

	const filler = [];

	for (let index = 0; index < MAX_TABLE_ITEMS - items.length ; index++) {
		filler.push(<tr key={`save-place-${index}`}>
			<td></td>
			<td></td>
			<td></td>
		</tr>);
	}
	return (
		<div className="react-attack-map-ticker">
			<table className="react-attack-map-table-container">
				<thead>
					<tr>
						<th><h1>Attack Type</h1></th>
						<th><h1>Origin</h1></th>
						<th><h1>Target</h1></th>
					</tr>
 				</thead>
 				<tbody>
					{items.map((item) => {
						return <tr key={item.id}>
							<td>
								<div className="react-table-type-wrapper">
								<div style={{ background: item.color, borderColor: item.color }} className={`react-table-type react-table-type-${item.color}`}/>
								<div>{item.type}</div>
								</div></td>
							<td>{item.origin}</td>
							<td>{item.destination}</td>
						</tr>;
						}
					)}
					{filler}
				</tbody>
				</table>
	  	</div>
	);
}
