import { select, arc } from 'd3';

const svg = select('svg');
// svg.style('background-color', 'red');
const height = +svg.attr('height');
const width = +svg.attr('width');
const g = svg.append('g')
  .attr('transform', `translate(${width / 2}, ${height / 2 + 40})`);

  const circle = g.append('circle')
  .attr('r', height/2)
  .attr('fill', 'yellow')
  .attr('stroke', 'black')

const eyeSpacing = 120;
const eyeOffSet = -30;
const eyeRadius = 25;

const leftEye = g.append('circle')
  .attr('r', eyeRadius)
  .attr('cx', -eyeSpacing)
  .attr('cy', eyeOffSet)

const rightEye = g.append('circle')
  .attr('r', eyeRadius)
  .attr('cx', +eyeSpacing)
  .attr('cy', eyeOffSet)
  .transition().duration(2000)
    .attr('y', eyeOffSet - 20 )

const mouth = g.append('path')
  .attr('d', arc()({
    innerRadius:80,
    outerRadius: 100,
    startAngle: Math.PI/2,
    endAngle: Math.PI * 3/2
  }));
