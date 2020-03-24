import { 
  select, 
  csv, 
  scaleLinear, 
  max, 
  scaleBand, 
  axisLeft, 
  axisBottom,
  format
} from 'd3';

const svg = select('svg');
// svg.style('background-color', 'red');
const width = +svg.attr('width');
const height = +svg.attr('height');

const render = data => {
  const xValue = d => d.num_colonies;
  const yValue = d => d.state;
  const margin = { top: 50, right: 50, bottom: 50, left: 200 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  

  const xScale = scaleLinear()
    .domain([0, max(data, xValue )])
    .range([0, innerWidth])
    

  const yScale = scaleBand()
    .domain(data.map(yValue))
    .range([0, innerHeight])
    .padding(0.2);
    
  const g = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`)

  g.append('g')
    .call(axisLeft(yScale))
    .selectAll(`.domain, .tick line`)
      .remove();

  const xAxis = axisBottom(xScale)
    .tickFormat(format('.3s'))
    .tickSize(-innerHeight)
      
  const xAxisG = g.append('g').call(xAxis)
    .attr('transform', `translate(0, ${innerHeight})`)
    
  xAxisG.select('.domain').remove();

  xAxisG.append('text')
    .attr('y', 40)
    .attr('x', innerWidth / 2)
    .attr('fill', 'black')
    .text('Population')

  g.selectAll('rect').data(data)
    .enter().append('rect')
      .attr('y', d => yScale(yValue(d)))
      .attr('width', d => xScale(xValue(d)))
      .attr('height', yScale.bandwidth())

  g.append('text')
    .attr('y', -10)
    .text('Bee Populations');

}


csv('data.csv').then(data => {
  data.forEach(d => {
    d.num_colonies = +d.num_colonies
  })
  render(data);
});
