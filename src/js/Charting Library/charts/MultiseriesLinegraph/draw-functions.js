import * as _ from 'lodash';
import * as d3 from 'd3';


// TODO
// parameterize this
export const transformMeltedToNestedCategorical = function (props){
	let categories = _.uniqBy(_.map(props.data, props.category));

	props.data = _.map(categories, (currentVar) =>{
		return {
			category: currentVar,
			values: _.map(_.filter(props.data, d => props.category(d) === currentVar),
							d => ({ x: +props.x(d), y: +props.y(d)}))
		}
	});

	props.x = d => d.x;
	props.y = d => d.y;
	props.values = d => d.values;
	props.category = d => d.category;

	return props;
}


/**
 * Draws simple X-Y axis
 */
export const drawXYAxes = function (props, selection){

	props.xAxis = props.xAxis || d3.axisBottom;
	props.yAxis = props.yAxis || d3.axisLeft;
	// Axes
	let xAxis = props.xAxis(props.xScale).ticks(5).tickSizeOuter([0]);
	let yAxis = props.yAxis(props.yScale).ticks(5).tickSizeOuter([0]);
	
	// create <g> to hold axes
	let gX = selection.select(`.x-axis`);
	if(gX.empty()){
		gX = selection.append('g').classed('x-axis', true);
	}

	let gY = selection.select(`.y-axis`);
	if(gY.empty()){
		gY = selection.append('g').classed('y-axis', true);
	}

	gX.transition().duration(700).call(xAxis);
	gY.transition().duration(700).call(yAxis);

	// move x axis to bottom
	gX.attr('transform', `translate(0, ${props.height + 10})`);
	gY.attr('transform', 'translate(-10, 0)');

	return props;
}

/**
 * Draws a multiseries set of lines
 * grouped by categorical data
 */
export const drawCategoricalPaths = function(props, selection){
	// draw lines for dleata
	let pathfn = d3.line().curve(d3.curveBasis)
		.x(d => props.xScale(props.x(d)))
		.y(d => props.yScale(props.y(d)));
	

	let paths = selection.selectAll('path')
						 .data(props.data);

	paths.exit()
		.remove();

	paths.transition()
		 .duration(700)
		 .ease(d3.easeLinear)
		 .attr('d', d => pathfn(props.values(d)))

	paths.enter()
		 .append('path')
		 .attr('d', d => pathfn(props.values(d)))
		 .attr('stroke', 'yellow')
		 .attr('stroke-width', '2px')
		 .attr('fill', 'none')
		 .on('mouseover', function(){
			d3.select(this)
				.transition()
				.duration(300)
				.ease(d3.easeLinear)
				.attr('stroke-width', '6px');
		 })
		 .on('mouseout', function(){
		 	d3.select(this)
				.transition()
				.duration(300)
				.ease(d3.easeLinear)
				.attr('stroke-width', '2px');
		 });

	return props;
}