import * as d3 from 'd3';


/**
 *
 * requires: 
 * 		[props.data]   - data
 * 		[props.x]      - mapping to x aesthetic
 * 		[props.y]      - mapping to y aesthetic
 * 		[props.xScale] - a d3 scale
 * 		[props.height, props.width]
 * 			
 */
export const basicXYScaleInitializer = function(props){

	let xScale = props.xScale || d3.scaleLinear;
	props.xScale = xScale().domain(d3.extent(props.data, props.x))
						   .range([0, props.width]);


	let yScale = props.yScale || d3.scaleLinear;
	props.yScale = yScale().domain(d3.extent(props.data, props.y))
						 .range([props.height, 0]);

	return props;
}


/**
 * requires:
 * 		[props.rawHeight, props.rawWidth]
 *
 * optional:
 * 		[props.margins]
 */
export const basicMarginInitializer = function(	props){
	props.rawHeight = props.rawHeight || props.height;
	props.rawWidth = props.rawWidth || props.width;

	if(props.margins){
		props.height = props.rawHeight - ((props.margins.bottom || 0) + (props.margins.top || 0));
		props.width = props.rawWidth - ((props.margins.left || 0) + (props.margins.right || 0));
	}

	return props;
}