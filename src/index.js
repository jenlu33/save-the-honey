import { 
  select, 
  csv, 
  scaleLinear, 
  max, 
  scalePoint, 
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
    .nice();
    

  const yScale = scalePoint()
    .domain(data.map(yValue))
    .range([0, innerHeight])
    .padding(0.3);
    
  const g = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`)


  const yAxis = axisLeft(yScale)
    .tickSize(-innerWidth)

  g.append('g')
    .call(yAxis)
    .select(`.domain`)
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

  g.selectAll('circle').data(data)
    .enter().append('circle')
    .attr('cy', d => yScale(yValue(d)))
      .attr('cx', d => xScale(xValue(d)))
      .attr('r', 6)

  g.append('text')
    .attr('y', -10)
    .text('Bee Populations');

}


csv('./data/data.csv').then(data => {
  data.forEach(d => {
    d.num_colonies = +d.num_colonies
  })
  render(data);
});
