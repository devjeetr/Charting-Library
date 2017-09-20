


import {Once, createMutator, MONAD} from '../utilities/functionalUtils';
import {basicXYScaleInitializer, basicMarginInitializer} from '../charts/common/init-functions';
import {Mediator} from './Mediator';

import * as d3 from 'd3';

let LayerGroup = MONAD();

// initialize props
LayerGroup.lift("init", function(layers){
	layers.forEach(layer => {layer.init()});
	return layers;		
});

// initialize Scales
LayerGroup.lift("initScales", function(layers){
	layers.forEach(layer => {layer.initScales()});
	return layers;
});

// apply any data transforms
LayerGroup.lift('transformData', function(layers){
	layers.forEach(layer => {layer.transformData()});
	return layers;
});


// Draws all geometries in this layer.
// Each geometry is in its own SVG group
// element
LayerGroup.lift('drawGeoms', function(layers, selection, layerClass = "layer"){
	console.log(layers[0])
	layers.forEach((layer, i) => {
		let currentLayerClassName = `${layerClass}-${i}`;
		let currentLayerGroupElem = selection.select(`.${currentLayerClassName}`);

		if(currentLayerGroupElem.empty()){
			currentLayerGroupElem = selection.append("g");
			currentLayerGroupElem.classed(currentLayerClassName, true);
		}

		layer.drawGeoms(currentLayerGroupElem);
	});

	return layers;
});


// initialize Scales
LayerGroup.lift("layer", function(layers, layer){
	if(layer){
		layers.push(layer);	
	}

	return layers;		
});

export {LayerGroup};