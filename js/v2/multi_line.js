// args 
// data_sets : array of data sets each dataset consists of two coloumns  , each element will represent a line
//             ex [0:{"year":"1995",population:"5000"} , 1:{...}] the columns must be same for all datasets
// colors : array of color codes for the lines , size must equal data
// container : id or class of the container 
// labels: labels for the for the key (Ex.Year), and each dataset , size = number of datasets  + 1
// classes : css classes for the lines

function drawLines(data_sets,labels, colors, classes,container) {



    function drawLineChart(data_sets, keys, container, col1, col2) {

        var parentDiv = container;

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


        // 

        
        values=[]
        for (i=0 ; i<data_sets.length;i++)
        {
         for(j=0;j<data_sets[i].length;j++)
         {
             values.push(parseFloat(data_sets[i][j][col2]));
         }   
        }

        // find the yscale domin
        var divider=parseFloat(1.0); 
        while((Math.max(...values)/divider)>10){
            divider=divider*10
        }

        var yDomainVal=Math.ceil(Math.max(...values)/divider)*divider





        var xScale = d3.scaleLinear()
            .domain([data_sets[0][0][col1], data_sets[0][data_sets[0].length - 1][col1]])
            .range([0, width]);


        var yScale = d3.scaleLinear()
            .domain([0, yDomainVal])
            .range([height, 0]);


        var line = d3.line()
            .x(function (d) { return xScale(d[col1]); })
            .y(function (d) { return yScale(d[col2]); })
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
                .tickValues(keys[col1])
                .tickSize(0)
                .tickPadding(10)
                .tickFormat(d3.format("")));

        svg.append('g')
            .attr('class', 'y axis')
            .call(d3.axisLeft(yScale)
                .tickFormat(d3.format(".2s")));



        for (i = 0; i<data_sets.length; i++) {
            drawLinePath(svg, data_sets[i], line, i)
        }










        for (i = 0; i<data_sets.length; i++) {
            svg.append('text')
                .attr('x', width + 5)
                .attr('y', yScale(data_sets[i][data_sets[i].length - 1][col2]))
                .style('fill',colors[i])
                .html(labels[i+1])
        }




        // Range axis 









        var tooltiprect = svg.append('rect')
            .attr('height', height)
            .attr('width', width)
            .attr('opacity', 0)
            .on('mousemove', drawTooltip);


        var tooltipLine = svg.append('line')
            .attr('stroke', 'none');




        function drawTooltip() {



            mYear = Math.floor(xScale.invert(d3.mouse(this)[0])) + 1;

            cYear = keys[col1][0];
            for (i = 0; i < keys[col1].length; i++) {
                if (Math.abs(cYear - mYear) > Math.abs(keys[col1][i] - mYear)) {
                    cYear = keys[col1][i];
                }


            }




            tooltipLine.attr('stroke', 'black')
                .attr('x1', xScale(cYear))
                .attr('x2', xScale(cYear))
                .attr('y1', 0)
                .attr('y2', height);



            var f2s = d3.format('.2s');
            var index = keys[col1].indexOf(cYear);
            console.log("x: " + d3.event.pageX + "y: " + d3.event.pageY);

            tooltipBoxText=labels[0]+" : " + cYear + " <br/>";
            for(i=0 ;i<data_sets.length;i++)
            {
                tooltipBoxText +=labels[i+1]+": "+f2s(data_sets[i][index][col2])+"<br/>";

            }
            tooltipBox
                .style('display', 'inline')
                .html(tooltipBoxText)
                .style('left', d3.mouse(this)[0] - 34)
                .style('top', d3.mouse(this)[1] - 12)
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









    //Line Chart








    col1 = data_sets[0].columns[0];
    col2 = data_sets[0].columns[1]
    keys={}
    keys[col1] = [];
    keys[col2] = [];
    for (i = 0; i < data_sets[0].length; i++) {
        keys[col1].push(data_sets[0][i][col1])
        keys[col2].push(data_sets[0][i][col2])

    }

    drawLineChart(data_sets, keys, container, col1, col2)










}
