import { 
  select, 
  csv, 
  scaleLinear,
  format,
  extent, 
  axisLeft, 
  axisBottom,
  line,
  curveBasis,
  mouse,
  event
} from 'd3';

const svg = select('svg');
const width = +svg.attr('width');
const height = +svg.attr('height');

const render = data => {
  const title = 'Honey Producing Bee Colonies in the United States';

  const xValue = d => d.year;
  const xAxisLabel = 'Year'

  const yValue = d => d.total;
  const yAxisLabel = 'Honey Producing Colonies';

  const margin = { top: 50, right: 50, bottom: 80, left: 80};
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  let selectedYear = data[0].year; //start position for beeCircle
  const setSelectedYear = year => {
    selectedYear = year;
  }

  let selectedPop = data[0].total;
  const setSelectedPop = total => {
    selectedPop = total
  }
  // console.log(selectedPop);
  // console.log(data[0]);
  
  const xScale = scaleLinear()
    .domain(extent(data, xValue))
    .range([0, innerWidth])
    // .nice();

  const yScale = scaleLinear()
    .domain(extent(data, yValue))
    .range([innerHeight, 0])
    .nice();

  const g = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.right})`);

  const xAxis = axisBottom(xScale)
    .tickFormat(format('d')) //remove commas to format year
    .tickSize(-innerHeight)
    .tickPadding(10)

  const yAxisTickFormat = num => (
    format('~s')(num * 1000)
  )

  const yAxis = axisLeft(yScale)
    .tickFormat(yAxisTickFormat)
    .tickSize(-innerWidth)
    .tickPadding(10);

  const yAxisG = g.append('g').call(yAxis);
  yAxisG.selectAll('domain').remove();

  // y-axis title
  yAxisG.append('text')
    .attr('y', -60)
    .attr('x', -innerHeight / 2)
    .attr('fill', 'black')
    .attr('transform', `rotate(-90)`)
    .attr('text-anchor', 'middle')
    .text(yAxisLabel);

  const xAxisG = g.append('g').call(xAxis)
    .attr('transform', `translate(0, ${innerHeight})`);
  
  xAxisG.select('domain').remove();

  // x-axis title
  xAxisG.append('text')
    .attr('y', 60)
    .attr('x', innerWidth / 2)
    .attr('fill', 'black')
    .text(xAxisLabel);

  const lineGenerator = line()
    .x(d => xScale(xValue(d)))
    .y(d => yScale(yValue(d)))
    .curve(curveBasis);

  const yPath = g.append('path')
    .attr('class', 'line-path')
    .attr('d', lineGenerator(data));


  // line animation
  const totalLength = yPath.node().getTotalLength()

  yPath
    .attr('stroke-dasharray', totalLength + ' ' + totalLength)
    .attr('stroke-dashoffset', -totalLength) //starting point on left side
    .transition()
      .duration(5000)
      .attr('stroke-dashoffset', 0)

  //Hover Effects

  const focus = g.append('g')
    .attr('class', 'focus')

  const beeCircle = focus.append('circle')
    .attr('r', 5)
    .attr('cx', xScale(selectedYear))
    .attr('cy', yScale(selectedPop))

  focus.append('rect')
    .attr('width', innerWidth)
    .attr('height', innerWidth)
    .attr('fill', 'none')
    .attr('pointer-events', 'all')
    .on('mousemove', () => {
      const x = mouse(g.node())[0];         //allows beeCircle to move along x axis with mouse
      const hoverDate = xScale.invert(x);
      const y = mouse(g.node())[1];        //allows beeCircle to move along y axis with mouse
      // const hoverPop = yScale.invert(y);
      // console.log(hoverPop);

      setSelectedYear(hoverDate);
      // console.log(hoverDate);
      // console.log(selectedYear)
      
      beeCircle.transition().duration(10)
        .attr('cx', xScale(selectedYear))
        // .attr('cy', yScale(selectedPop))

       for (let i = 0; i < data.length; i++) {
        //  if (data[i].year === Math.floor(selectedYear)) {
        //    const newY = data[i].total
        //    console.log(newY);
           
        //    beeCircle.transition().duration(10)
        //     .attr('cy', yScale(data[i].total) )
        //  }

          if (data[i].year === Math.floor(hoverDate)) {
            const newY = data[i].total
            beeCircle.transition().duration(10)
              .attr('cy', yScale(newY))
            
          }
       }

    });

  
    
  // console.log(selectedYear)

  //graph title
  g.append('text')
    .attr('class', 'title')
    .attr('y', -10)
    .text(title);
}


csv('./data/yearly_pop.csv').then(data => {
  // data.forEach(d => {
  //   const year = Object.keys(d)
  //   d.years = +d.years
  // })

  
  // console.log(Object.values(data));
  // console.log(data.columns.slice(1));

  // data.columns.slice(1).forEach(year => {
  //   year = +year
  // })
  
  data.forEach(d => {
    d.year = +d.year
    d.total = +d.total
  })
  
  render(data);
});
