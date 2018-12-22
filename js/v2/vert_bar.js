


function drawVertBar(){

var parentDiv='#vertBar';



d3.csv("data/ad_pop_total.csv").then(function (data) {


    var dataTotal = data;
    var dataLocal;
    var dataNLocal;

    dataset = { 'year': [], 'population': [] };
    for (i = 0; i < data.length; i++) {
        dataset['year'].push(data[i].year)
        dataset['population'].push(data[i].population)



    }
    d3.csv("data/ad_local_pop.csv").then(function (data1) {
        dataLocal = data1;

        d3.csv("data/ad_nlocal_pop.csv").then(function (data2) {
            dataNLocal = data2;

            drawVertBarChart(data, dataNLocal, dataLocal, dataset)



        });


    });





});

function drawVertBarChart(data, dataNLocal, dataLocal, dataset) {

    var maxHeight = screen.height;
    var parentWidth = d3.select(parentDiv).node().getBoundingClientRect().width;
    var height = 0;
    var width = 0

    if (0.75 * parentWidth > 0.75 * maxHeight) {
        height = 0.75 * maxHeight;
        width = 1.34 * height;

    }

    else {

        width = parentWidth
        height = parentWidth;

    }

    var margin = { top: 30, down: 30, right: 30, left: 30 }
        , width = width- margin.left - margin.right
        , height = (height*0.75)- margin.top - margin.down
        , chartC = { x0: 200, x1: width, y0: 30, y1: height }
        , percentageFormatter = d3.format(',.1%');

    // the number of data points




    var svg = d3.select(parentDiv).append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.down)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`)


    //svg.append('g').append('text')
    //    .attr('transform', d => `translate(${-10},${-10})`)
    //    .text('Local Percentage of Total Abu Dhabi Population')



    var chart = svg.append('g')
        .attr('transform', `translate(${chartC.x0},${chartC.y0})`)


    var chartTitle=chart.append('text')
    .attr('transform', `translate(${10},${-10})`)
    .style('font-size','0.8em')
    .attr('class','lead')
    .html(`Normalized Population Index |<tspan style="fill:cornflowerblue"> Local Percentage</tspan> `)






    var yScale_0 = d3.scaleBand()
        .domain(dataset.year)
        .range([chartC.y1-chartC.y0-margin.top, 0])
        .paddingInner(0.2)

    var yScale_1 = d3.scaleBand()
        .domain(['L', 'NL'])
        .range([yScale_0.bandwidth(), 0]);



    var xScales = [];

    for (i = 0; i < dataNLocal.length; i++) {

        x = d3.scaleLinear()
            .domain([0, parseInt(dataNLocal[i].population) + parseInt(dataLocal[i].population)])
            .range([0, width-margin.left-chartC.x0]);

        //console.log(x(dataNLocal[i].population));
        //console.log(x.range());


        xScales.push(x);

    }

    //console.log(yScale_1('L'));


    chart.append('g')
        .attr('class', 'axis labels')
        //.attr('transform', `translate(${0},${0})`)
        .call(d3.axisLeft(yScale_0))


    var o = chart.append('g')
        .selectAll('g')
        .data(dataNLocal)
        .enter()
        .append('g')
        .attr('transform', d => `translate(${0},${yScale_0(d.year)})`);


    o.append('rect')
        .attr('class', 'nlocal')
        .attr('x', 10)
        .attr('y', yScale_1('L'))
        .attr('height', yScale_1.step()*0.7)
        .attr('width', (d, i) => xScales[i](parseInt(dataNLocal[i].population)))


    o.append('rect')
        .attr('class', 'local')
        .attr('x', 10)
        .attr('y', yScale_1('NL'))
        .attr('height', yScale_1.step()*0.7)
        .attr('width', (d, i) => xScales[i](parseInt(dataLocal[i].population)))


    o.append('text')
        .attr('class', 'local')
        .attr('x', (d, i) => xScales[i](parseInt(dataLocal[i].population)) + 15)
        .attr('y', yScale_1('L') - yScale_1.step()*0.5)
        .style("font-size", "90px;")
        .text((d, i) => percentageFormatter(parseInt(dataLocal[i].population) / (parseInt(dataLocal[i].population) + parseInt(dataNLocal[i].population))))




    var legend = svg.append('g')
                    .attr('transform',`translate(10,30)`);
    
    legend.append('g')
    .attr('transform',`translate(0,0)`)
    .append('rect')
    .attr('class','local')
    .attr('width',10)
    .attr('height',10);

    legend.append('g')
    .attr('transform',`translate(14,9)`)
    .append('text')
    .attr('class','local')
    .text('Local')


    legend.append('g')
    .attr('transform',`translate(0,15)`)
    .append('rect')
    .attr('class','nlocal')
    .attr('width',10)
    .attr('height',10);

    legend.append('g')
    .attr('transform',`translate(14,24)`)
    .append('text')
    .attr('class','nlocal')
    .text('Foreign')
}
}
drawVertBar();