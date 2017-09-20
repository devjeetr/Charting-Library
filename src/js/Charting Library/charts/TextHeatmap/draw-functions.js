import * as _ from 'lodash';
import * as d3 from 'd3';
import * as d3Hsv from 'd3-hsv'
import * as d3Contours from 'd3-contour';


require('d3-shape');
require('d3-scale');
require('d3-transition');
require('d3-contour');


import {basicMarginInitializer} from '../common/init-functions';

export const heatmapGridInitializer = function(props){
  let maxCols = d3.extent(props.data, props.x)[1];
  let maxRows = d3.extent(props.data, props.y)[1] + 1;

  props = basicMarginInitializer(props)

  console.assert(props.height > 0, "invalid height or margin: " + props.height);
  console.assert(props.width > 0, "invalid width or margin: ");

  props.gridHeight = (props.height / maxRows);
  props.gridWidth = props.width / maxCols;
  
  props.numberOfCols = maxCols;
  props.numberOfRows = maxRows;

  return props;
}


export const drawContours = function(props, selection){
  let heatmapValues = {};
  props.data.forEach(d => {
    let row = props.y(d), col = props.x(d);
    if(heatmapValues[row] === null || heatmapValues[row] === undefined
      || heatmapValues[row][col] === null || heatmapValues[row][col] === undefined){

        heatmapValues[row] = heatmapValues[row] || [];

        heatmapValues[row][col] = props.z(d);
        if(props.z(d) > 0)
          console.log(`(${row}, ${col} => ${props.z(d)})`)
    }
  });

  let heatmapFlattenedArray = [];
  for(let row = 0; row < props.numberOfRows; row++){
    for(let col = 0; col < props.numberOfCols; col++){

      if(heatmapValues[row] && heatmapValues[row][col]){
        heatmapFlattenedArray.push(heatmapValues[row][col]);
      }else{
        heatmapFlattenedArray.push(0.0);
      }
    }
  }

  // let n = props.numberOfCols, m = props.numberOfRows, values = new Array(n * m);
  // for (let j = 0, k = 0; j < m; ++j) {
  //   for (let i = 0; i < n; ++i, ++k) {
  //     values[k] = heatmapValues[j][i];
  //   }
  // }

  // console.log(values);
  // heatmapFlattenedArray = values;

  let extent = d3.extent(heatmapFlattenedArray);
  // heatmapFlattenedArray.forEach((d, i) => console.log(`${i}: ${d}`))

  let i0 = d3Hsv.interpolateHsvLong(d3Hsv.hsv(120, 1, 0.65), d3Hsv.hsv(60, 1, 0.90)),
        i1 = d3Hsv.interpolateHsvLong(d3Hsv.hsv(60, 1, 0.90), d3Hsv.hsv(0, 0, 0.95)),
        interpolateTerrain = function(t) { return t < 0.5 ? i0(t * 2) : i1((t - 0.5) * 2); },
        color = d3.scaleSequential(interpolateTerrain).domain(extent);
  
  let contourData = d3Contours.contours()
                              .size([props.numberOfCols, props.numberOfRows])
                              .thresholds(d3.range(...extent, 0.01))(heatmapFlattenedArray);
  
  // let height = props.numberOfRows * props.gridHeight;
  // let width  = props.numberOfCols * props.gridWidth;

  let scalingFactor = Math.max(props.gridHeight, 
                               props.gridWidth)


  selection.selectAll("path")
           .data(contourData)
           .enter().append("path")
           .attr("d", d3.geoPath(d3.geoIdentity().scale(scalingFactor)))
           .attr("fill", d => color(d.value));
}


/**
 * requires: [props.text, props.x, props.y, props.z, props.gridHeight, props.gridWidth]
 * optional: font-size
 */
export const drawText = function (props, selection, heatmapClassName = 'heatmap-text'){
	let heatmapText = selection.select(`.${heatmapClassName}`);
	
	if(heatmapText.empty()){
		heatmapText = selection.append("g")
    heatmapText.classed('${heatmapClassName}');
	}
	
	let elemRoot = heatmapText.selectAll('text').data(props.data);

    elemRoot.enter().append('text')
           .attr('x', (d, i) => +props.x(d) * props.gridWidth + (props.gridWidth / 2))
           .attr('y', (d, i) => (+props.y(d) + 1) * props.gridHeight - (props.gridHeight / 2))
           .text(props.text)
           .attr('text-anchor', 'middle')
           .attr('alignment-baseline', 'middle')
           .attr('font-size', Math.min(props.gridHeight, props.gridWidth));

    elemRoot.attr('x', (d, i) => +props.x(d) * props.gridWidth + (props.gridWidth / 2))
           .attr('y', (d, i) => (+props.y(d) + 1) * props.gridHeight - (props.gridHeight / 2))
           .text(props.text)
           .attr('text-anchor', 'middle')
           .attr('alignment-baseline', 'middle')
           .attr('font-size', Math.min(props.gridHeight, props.gridWidth));

    elemRoot.exit().remove();

}

// export const drawHeatmap = function(props, selection){
  



//   let n = props.numberOfCols,
//       m = props.numberOfRows;

//   let canvas = selection.select("canvas")
//       .attr("width", n)
//       .attr("height", m);

//   let context = canvas.node().getContext("2d"),
//       image = context.createImageData(n, m);

//   for (let j = 0, k = 0, l = 0; j < m; ++j) {
//     for (let i = 0; i < n; ++i, ++k, l += 4) {
//       let c = d3.rgb(color(volcano.values[k]));
//       image.data[l + 0] = c.r;
//       image.data[l + 1] = c.g;
//       image.data[l + 2] = c.b;
//       image.data[l + 3] = 255;
//     }
//   }

//   context.putImageData(image, 0, 0);

// }

export const drawGrid = function(props, selection, gridClassName = 'grid'){
  let grid = selection.select(`.${gridClassName}`);
  
  if(grid.empty()){
    grid = selection.append("g");
    grid.classed(gridClassName, true);
  }
    let gridElems = grid.selectAll('rect')
                      .data(props.data);
  gridElems.enter()
           .append('rect')
           .attr('x', (d, i) => (props.x(d) * props.gridWidth))
           .attr('y', (d, i) => (props.y(d) * props.gridHeight))
           .attr('height', props.gridHeight)
           .attr('width', props.gridWidth)
           .attr('stroke', 'black')
           .attr('fill', d => {
                      if(props.color)
                        return props.color(d.duration)
                    else return 'none';
                  } || 'none' )
           .attr('opacity', 0.9)
           .on("click", d =>{
              console.log(d);
           });
  
}