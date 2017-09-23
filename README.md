# Charting Library

This charting library is more of a reusable framework for d3 charts rather than a comprehensive library for data visualizations. It is inspired by the seminal paper "Grammar of Graphics" by Leland Wilkinson, and of course Hadley Wickham's "A Layered Grammar of Graphics". 

Or for those who know R, this is a javascript version of GGPlot2 with events!


## Wait, Grammar of Graphics what?

In his original paper, Wilkinson set out to establish a "grammar" for data visualizations, the bare minimum parameters you need to define to convert a dataset into a visualization. 

For starters, you need data. This data will map on to geometric shapes on the plot, for example, lines in a linegraph and points in a scatterplot or nodes/edges in a graph. Now we need a definition for how the data should be mapped to the geometric shape. This could just be how the position of the geometric shapes maps to the data, or it could be other aesthetic features such as size and color. Now we also need a scale to scale the data to pixels on the screen to make sure all the data fits in. We can also add in data transformations, for when we want to plot a frequency/distribution plot, such as a histogram. Lastly, we can also add facets, which I'll talk about later.

For example, if we have population data for people of different income groups in a city over the years, we have three columns, Year, Population and Income Group, and we want to draw a linegraph. Here, we can define Year to the x-coordinate of line and Population to the y-coordinate of of the line and we have a simple linegraph. We can also now provide a color aesthetic to map different colors to the lines based on the income group. Easy!

So here is what the grammar of graphics as proposed by Wilkinson:
* Data
* Aesthetic Mappings
* Geometry
* Scale
* Data Transforms
* Facets

Now Hadley Wickham, in his paper, proposed a layered grammar where a given visualization has multiple layers, and each layer could have it's own data, aesthetics, geomety, scale, transforms and facets. Even better!

[Here's](http://byrneslab.net/classes/biol607/readings/wickham_layered-grammar.pdf) a link to Wickham's paper. I couldn't find Wilkinson's original paper for free online but I recommend reading it as well for a deeper understanding of the subject.

## Why?

As I was working on a visualization project recently, I found that writing reusable D3 code is not easy or straightforward. There is an elegant way proposed by the phenomenal Mike Bostock(creator of D3), as outlined [here](https://bost.ocks.org/mike/chart/). It makes clever use of the cascading pattern and is simply elegant. 

However, it does have its limitations in certain use cases. For example, lets say you made a reusable linegraph according to Mike's pattern. Now let's say you wanted to add a scatterplot to the linegraph. You would have to internally modify the original code, or worse, copy the original code and make a separate module that now draws a linegraph along with a scatterplot. 

This is something that can easily be solved using a Grammar of Graphics approach. For the linegraph you pass in the data, scale and aesthetics. Now to add a scatterplot, now you can just add another layer that shares the same data and scale, and aesthetics. The only thing that changes is the geometry for the new layer. 

Using a GoG approach, as in GGPlot2 or my framework, this is how we'd do it:

Let's say we have a function that draws categorical paths(paths colored according to their category), called drawCategoricalPaths, and another function called drawScatter that draws simple points based on category as well.

We can create a Layer by passing in a 'props' object that is used to initialize layer properties.

for the linegraph, we only need to define the data, its aesthetic mappings(x, y, category) and geometry.
```javascript
let linegraph = Layer({
		data: data,
		x: d => d.Time,
		y: d => d.value,
		category: d => d.variable,
		geom: [drawCategoricalPaths],
    //...other aesthetic mappings such as height, width, margins etc
    });
```
now to transform to a linegraph with scatterplot:
```javascript
let scatterplot = Layer({
		data: data,
		x: d => d.Time,
		y: d => d.value,
		category: d => d.variable,
		geom: [drawScatter],
    //...other aesthetic mappings such as height, width, margins etc
    });
 
 let linegraphWithScatterPlot = new LayerGroup([linegraph, scatterplot])
 
```

To add more stuff the the graph, all you need to do is add more layers. Maximum code reuse!
In fact you don't even need to define a separate layer for adding the scatterplot to the original linegraph. That was done to show the use case for more complicated examples, but for this particular example, you can simply modify the original definition of linegraph as follows:

```javascript
let linegraph = Layer({
		data: data,
		x: d => d.Time,
		y: d => d.value,
		category: d => d.variable,
		geom: [drawCategoricalPaths, drawScatter], // <- just add drawScatter to the list of geometries!
    //...other aesthetic mappings such as height, width, margins etc
    });
```

Now you will need to have coded drawCategoricalPaths and drawScatter, but you don't have to worry about whether these two functions will "mess" with each other. All you need to know is you will be given an SVG <g> element, and you need to draw on it. [Feature Not Complete] You can define dependencies, for example, that your draw function needs an x aesthetic and a y aesthetic, and also some data!

Lastly, this framework uses a pub/sub event pattern, where each layer can have its own events. This provides a lot of room for composition.

#### To summarize, this is an alternative reusable framework for writing reusable D3 charts




