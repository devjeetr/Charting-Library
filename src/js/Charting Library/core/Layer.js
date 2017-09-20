import {Once, createMutator, MONAD} from '../utilities/functionalUtils';
import {basicXYScaleInitializer, basicMarginInitializer} from '../charts/common/init-functions';
import {Mediator} from './Mediator';

import * as d3 from 'd3';


const DEFAULT_MARGINS = {
	top: 50,
	bottom: 200,
	right: 150,
	left: 50
}


let LayerFactory = MONAD();

// initialize Scales
LayerFactory.lift("init", function(props){
									if(props.mediator === null || props.mediator === undefined){
										props.mediator = Mediator({})
									}
									props.margins = props.margins || DEFAULT_MARGINS;
									if(props.initializer){
										props = props.initializer(props);
									}else{
									    
										props = basicMarginInitializer(props);
									}
									
									return props;
								});

// initialize Scales
LayerFactory.lift("initScales", function(props){
	if(props.scaleInitializor){
		return props.scaleInitializor(props);
	}

	return props;
});

// apply any data transforms
LayerFactory.lift('transformData', function(props){
	if(props.dataTransform){
		props.dataTransform(props);	
	}
	
	return props;
})


// Draws all geometries in this layer.
// Each geometry is in its own SVG group
// element
LayerFactory.lift('drawGeoms', function(props, selection){
	if(props.geom){
		if(selection && !selection.empty()){
			
			let layerContent = initializeLayerSelection(props, selection);
			let layerScale = layerContent.append('g')
										 .classed("scale", true);
			
			// TODO what is this?
			if(props.axes){
				props.axes(props, layerScale);
			}

			drawAllGeometry(props, layerContent);
		}
	}

	return props;
})


/**
 * 			Helper functions
 */


export const initializeLayerSelection = function(props, selection){
	selection.attr('height',props.rawHeight)
		     .attr('width', props.rawWidth);
			
	let layerContent = selection.append('g');

	layerContent.attr('height', props.height)
		  .attr('width', props.width)
		  .attr('transform', `translate(${props.margins.left}, ${props.margins.bottom})`);

	return layerContent;
}


function drawAllGeometry(props, selection){

	if(props.geom.constructor === Array){

		props.geom.forEach((geom, i) => {
			let geomRoot = selection.select(`.geom-${i}`);
			if(geomRoot.empty()){
				geomRoot = selection.append('g')
									.classed(`geom-${i}`, true)
			}

			geom(props, geomRoot);
		});

	}else{
		let geomRoot = selection.select(`.geom-0`);
		if(geomRoot.empty()){
			geomRoot = selection.append('g')
								.classed(`geom-0`, true)
		}

		props.geom(props, geomRoot);
	}
}


let applyValueToProps = function(props, value, name){
							if(value){
								if(props[name]){
									props[name] = value;
									props.mediator.publish(`${name}Update`, props);
								}else{
									props[name] = value;
								}
							}

							return props;
						};


// Lift each property into the monad, besides geom
let properties = ['x', 'y', 'xScale', 'yScale', 'data', 'dataTransform', 'shape', 
					'height', 'width'];

properties.forEach(function(propertyName){
	LayerFactory.lift(propertyName, function(props, value){
		return applyValueToProps(props, value, propertyName);
	});	
});

LayerFactory.lift("geom", function(props, value){
	if(value){
		if(props["geom"]){
			if(props["geom"].constructor !== Array){
				let tmp = prop["geom"]
				props["geom"] = []
				props.push(tmp);
			}

			props["geom"].push(value);
		}else{
			props["geom"] = [value]
		}
	}
})



LayerFactory.lift('dumpProps', function(props){
	console.log(props);
})


let Layer = LayerFactory;


export {Layer};