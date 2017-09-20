import * as _ from 'lodash';
import * as d3 from 'd3';

import {Layer} from '../../core/Layer'
import {drawXYAxes, drawCategoricalPaths} from './draw-functions';


function subscriber(fn, updateEventName){
	return function(props, selection){
		console.log("inside")
		fn(props, selection);
		props.mediator.subscribe(updateEventName, function(updatedProps){
					return fn(updatedProps, selection);
				});

		return props;
	}
};


function MultiseriesLinegraph(props){



	function chart(){
		let layer = Layer({
						x: props.x,
						y: props.y,
						category: props.category,
						dataTransform: transformMeltedToNestedCategorical,
						height: props.height,
						width: props.width,
						color: d => d.color,
						geom: [subscriber(drawCategoricalPaths, "dataUpdate")],
						axes: subscriber(drawXYAxes, "dataUpdate")
					});
	}

	chart.draw = function(selection){
		
		
	}



}