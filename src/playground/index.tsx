// import d3 from 'd3';
import React from 'react';
import ReactDOM from 'react-dom';
import { AttackMap } from '../AttackMap';
// import { DataMapsWrapper } from '../DataMapsWrapper';

ReactDOM.render(
  <React.Fragment>
	<div className="test">
	  <AttackMap demoMode={true}/>
	</div>
  </React.Fragment>,
  document.getElementById('root'),
);
