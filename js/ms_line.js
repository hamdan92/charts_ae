function drawLines() {



    function drawLineChart(data, dataNLocal, dataLocal, dataset) {

        parentDiv = "#lines";

        var maxHeight = screen.height;
        var parentWidth = d3.select(parentDiv).node().getBoundingClientRect().width;
        var height = 0;
        var width = 0
        var minWidth=400;

        if(parentWidth <minWidth) {
            parentWidth= minWidth
        }

        if (0.75 * parentWidth > 0.75 * maxHeight) {
            height = 0.75 * maxHeight;
            width = 1.34 * height;

        }

        else {

            width = parentWidth
            height = parentWidth;

        }


        var margin = { top: 30, down: 30, right: 80, left: 40 }
            , width = width - margin.left - margin.right
            , height = (height * 0.75) - margin.top - margin.down;

        // the number of data points



        var xScale = d3.scaleLinear()
            .domain([data[0].year, data[data.length - 1].year])
            .range([0, width]);

        var yScale = d3.scaleLinear()
            .domain([0, 3000000])
            .range([height, 0]);


        var line = d3.line()
            .x(function (d) { return xScale(d.year); })
            .y(function (d) { return yScale(d.population); })
            .curve(d3.curveMonotoneX);


        var tooltipBox = d3.select(parentDiv).append('div')
            .style('position', 'absolute')
            .style('background', 'lightgray')
            .style('padding', '5px')


        var svg = d3.select(parentDiv).append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.down)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`)

        svg.append('g')
            .attr('class', 'x axis')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(xScale)
                .tickValues(dataset.year)
                .tickSize(0)
                .tickPadding(10)
                .tickFormat(d3.format("")));

        svg.append('g')
            .attr('class', 'y axis')
            .call(d3.axisLeft(yScale)
                .tickFormat(d3.format(".2s")));




        drawLinePath(svg, data, line, 0)

        drawLinePath(svg, dataLocal, line, 2)

        drawLinePath(svg, dataNLocal, line, 1)


        /*svg.selectAll('.dot')
            .data(data)
            .enter()
            .append('circle')
            .attr('class', 'dot')
            .attr('cx', function (d) { return xScale(d.year); })
            .attr('cy', function (d) { return yScale(d.population); })
            .attr('r', 5)
            .on('mouseover', function (a, b, c) {
                console.log(c)
                d3.select(this).attr('class', 'focus')
            })
            .on("mouseout", function () { d3.select(this).attr('class', 'dot') })*/








        svg.append('text')
            .attr('x', width + 5)
            .attr('y', yScale(data[data.length - 1].population))
            .style('fill', '#ffab00')
            .html('Total')

        svg.append('text')
            .attr('x', width + 5)
            .attr('y', yScale(dataNLocal[dataNLocal.length - 1].population))
            .style('fill', 'red')
            .html('Non Local')


        svg.append('text')
            .attr('x', width + 5)
            .attr('y', yScale(dataLocal[dataNLocal.length - 1].population))
            .style('fill', "green")
            .text('Local')



        // Range axis 









        //svg.on('mousemove',drawTooltip);
        var tooltiprect = svg.append('rect')
            .attr('height', height)
            .attr('width', width)
            .attr('opacity', 0)
            .on('mousemove', drawTooltip);


        var tooltipLine = svg.append('line')
            .attr('stroke', 'none');

        //var tooltipBox = d3.select('#tooltip');



        function drawTooltip() {
            
                console.log(d3.mouse(this));
        
            
            //console.log(Math.floor(xScale.invert(d3.mouse(this)[0])))
            mYear = Math.floor(xScale.invert(d3.mouse(this)[0])) + 1;

            cYear = dataset.year[0];
            for (i = 0; i < dataset.year.length; i++) {
                if (Math.abs(cYear - mYear) > Math.abs(dataset.year[i] - mYear)) {
                    cYear = dataset.year[i];
                }

                //console.log("myear " + Math.floor(xScale.invert(d3.mouse(this)[0])))
                //console.log("cyear " + cYear);


            }




            tooltipLine.attr('stroke', 'black')
                .attr('x1', xScale(cYear))
                .attr('x2', xScale(cYear))
                .attr('y1', 0)
                .attr('y2', height);



            var f2s = d3.format('.2s');
            var index = dataset.year.indexOf(cYear);
            console.log("x: "+ d3.event.pageX + "y: " + d3.event.pageY);
            tooltipBox
                .style('display', 'inline')
                .html("Year : " + cYear + " <br/>" + "Total: " + f2s(data[index].population) + "<br/>" + "Non Local: " + f2s(dataNLocal[index].population) + "<br/>" + "Local: " + f2s(dataLocal[index].population))
                //.style('left', d3.event.pageX - 34)
                //.style('top', d3.event.pageY - 12)
                .style('left', d3.mouse(this)[0] -34 )
                .style('top',  d3.mouse(this)[1] -12)
        }


    }

    function drawLinePath(svg, data, line, type) {
        var className;
        if (type == 1) className = 'lineNLocal';
        else if (type == 2) className = 'lineLocal';
        else className = 'lineTotal';

        svg.append('path')
            .datum(data)
            .attr('class', className)
            .attr('d', line)
    }

    function drawLineLabel(svg, data, label) {

    }







    //Line Chart
    d3.csv("data/ad_pop_total.csv").then(function (data) {



        var dataTotal = data;
        var dataLocal;
        var dataNLocal;


        col1=data.columns[0];
        col2=data.columns[1]

        dataset[col1] =[];
        dataset[col2]=[] ;
        for (i = 0; i < data.length; i++) {
            dataset[col1].push(data[i][col1])
            dataset[col2].push(data[i][col2])



        }
        d3.csv("data/ad_local_pop.csv").then(function (data1) {
            dataLocal = data1;

            d3.csv("data/ad_nlocal_pop.csv").then(function (data2) {
                dataNLocal = data2;

                drawLineChart(data, dataNLocal, dataLocal, dataset)



            });


        });





    });


}
drawLines();