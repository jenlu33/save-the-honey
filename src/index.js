import { select, csv, scaleLinear, max, scaleBand } from 'd3';

const svg = select('svg');
// svg.style('background-color', 'red');
const width = +svg.attr('width');
const height = +svg.attr('height');

const render = data => {
  const xValue = d => d.Population;
  const yValue = d => d.Country;
  const margin = { top: 50, right: 50, bottom: 50, left: 50 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const xScale = scaleLinear()
    .domain([0, max(data, xValue )])
    .range([0, innerWidth])

  const yScale = scaleBand()
    .domain(data.map(yValue))
    .range([0, innerHeight]);

  const g = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`)
  
  g.selectAll('rect').data(data)
    .enter().append('rect')
      .attr('y', d => yScale(yValue(d)))
      .attr('width', d => xScale(xValue(d)))
      .attr('height', yScale.bandwidth())
}

csv('data.csv').then(data => {
  data.forEach(d => {
    d.Population = +d.Population
  })
  render(data);
});
