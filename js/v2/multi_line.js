// args 
// data_sets : array of data sets each dataset consists of two coloumns  , each element will represent a line
//             ex [0:{"year":"1995",population:"5000"} , 1:{...}] the columns must be same for all datasets
// colors : array of color codes for the lines , size must equal data
// container : id or class of the container 
// labels: labels for the for the key (Ex.Year), and each dataset , size = number of datasets  + 1
// classes : css classes for the lines
// xAxis_visable: hide or show the x axis (true/false)
//h2w_ratio=height to width ratio
// yAxis_side= y axis on left or right

function LineChart (data_sets,labels, colors, classes,container,yAxis_side='left',xAxis_visable=true,h2w_ratio=0.75,yAxis_tick_format='.2s',tooltip_format='.2s') {

    var svg;
    var tooltipLine;
    var tooltipBox;
    var xScale;
    var yScale;
    var height;
    var width;
    var listeners=[]
    var margin;


    function drawLineChart(data_sets, keys, container, col1, col2) {

        var parentDiv = container;

        var maxHeight = screen.height;
        var parentWidth = d3.select(parentDiv).node().getBoundingClientRect().width;
        
        height = 0;
        width = 0;

        var minWidth=400;

        if(parentWidth <minWidth) {
            parentWidth= minWidth
        }

        width=parentWidth;
        height=width*h2w_ratio;

        //console.log('w '+width+' h'+height);

        /*
        if (h2w_ratio * parentWidth > h2w_ratio * maxHeight) {
            height = h2w_ratio * maxHeight;
            width = 1.34 * height;

        }
       

        else {

            width = parentWidth
            height = parentWidth;

        }
 */

         margin = { top: 30, down: 30, right: 80, left: 40 }
            , width = width - margin.left - margin.right
          //  , height = (height * h2w_ratio) - margin.top - margin.down;
          , height = height  - margin.top - margin.down;


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



        if(!isNaN(data_sets[0][0][col1])) {
            xScale = d3.scaleLinear()
            .domain([data_sets[0][0][col1], data_sets[0][data_sets[0].length - 1][col1]])
            .range([0, width]);

        } else  {

            xScale = d3.scaleBand()
            .domain(keys[col1])
            .rangeRound([0, width]);

        }

        if (!isNaN(data_sets[0][0][col2])){
        yScale = d3.scaleLinear()
            .domain([0, yDomainVal])
            .range([height, 0]);
        } else {

            yScale = d3.ScaleBand()
            .domain([0, yDomainVal])
            .rangeRound([height, 0]);

        }

        var line = d3.line()
            .x(function (d) { return xScale(d[col1]); })
            .y(function (d) { return yScale(d[col2]); })
            .curve(d3.curveMonotoneX);


        tooltipBox = d3.select('body').append('div')
            .style('position', 'absolute')
            .style('fill', 'lightgray')
            .style('padding', '5px')
            .style('display','none')
            .attr('class','alert alert-info')

            console.log(d3.select(tooltipBox.parentNode))



        svg = d3.select(parentDiv)//.append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.down)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`)

        console.log(keys[col1])            

        

        if(xAxis_visable==true){

            var xAxis=svg.append('g')
            .attr('class', 'x axis')
            .attr('transform', `translate(0,${height})`)

        if (!isNaN(keys[col1][0])){
            xAxis.call(d3.axisBottom(xScale)
            .tickValues(keys[col1])
            .tickSize(0)
            .tickPadding(10)
           .tickFormat(d3.format(""))
            );
        }

        else{
            ticksVals=[]
            for (i=4;i<keys[col1].length+4;i++){

                if(i%4 ==0)
                {
                    ticksVals.push(keys[col1][i-4])
                }
            

            }
            xAxis.call(d3.axisBottom(xScale)
            .tickValues(ticksVals)
            .tickSize(0)
            .tickPadding(10)
     //       .tickFormat(d3.format(""))
            );
        }
    }

        

        var yAxis=svg.append('g')
            .attr('class', 'y axis')
            .call(d3.axisLeft(yScale)
                .tickFormat(d3.format(yAxis_tick_format)));

        if(yAxis_side == 'right') {
            yAxis.attr('transform',`translate(${width},${0})`)
        }



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






        var tooltiprect;
        if (!isNaN(keys[col1][0])){

            tooltiprect = svg.append('rect')
            .attr('height', height)
            .attr('width', width)
            .attr('opacity', 0)
            .on('mousemove', drawTooltip);

        } else {
            tooltiprect = svg.append('g').selectAll('rect').data(keys[col1]).enter().append('rect')
            .attr('height', height)
            .attr('width', xScale.step())
            .attr('transform',(d,i)=>{return `translate(${xScale.step()*i},${0})`})
            .attr('opacity', 0)
            .attr('label',(d,i)=>{return keys[col1][i]})
            .on('mousemove', drawTooltip);
        }


        

        


        tooltipLine = svg.append('line')
            .attr('stroke', 'none');




        function drawTooltip() {

 

            var mTime;
            var cTime;
            if (!isNaN(keys[col1][0])){




            mTime = Math.floor(xScale.invert(d3.mouse(this)[0])) + 1;

            cTime = keys[col1][0];
            for (i = 0; i < keys[col1].length; i++) {
                if (Math.abs(cTime - mTime) > Math.abs(keys[col1][i] - mTime)) {
                    cTime = keys[col1][i];
                }


            }
        }

        else {

            console.log(d3.select(this).attr('label'))
            cTime=d3.select(this).attr('label');

        }


        for (i=0;i<listeners.length;i++){
            listeners[i](cTime);
        }


            tooltipLine.attr('stroke', 'black')
                .attr('x1', xScale(cTime))
                .attr('x2', xScale(cTime))
                .attr('y1', 0)
                .attr('y2', height);



            var f2s = d3.format(tooltip_format);
            var index = keys[col1].indexOf(cTime);
            //console.log("x: " + d3.event.pageX + "y: " + d3.event.pageY);

            tooltipBox.selectAll('*').remove();
            tooltipBoxText=labels[0]+" : " + cTime + " <br/>";
            for(i=0 ;i<data_sets.length;i++)
            {
                tooltipBoxText +=labels[i+1]+": "+f2s(data_sets[i][index][col2])+"<br/>";

            }
            tooltipBox
            . attr('transform',`translate(${ d3.mouse(this)[0] - 34},${ d3.mouse(this)[1] - 12})`)
            d3.mouse(document.body)

            tooltipBox
                .style('display', 'inline')
                .style('left', d3.mouse(document.body)[0] - 120)
                .style('top', d3.mouse(document.body)[1] - 100)
                .html(tooltipBoxText)

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








this.triggerMouse=function(x,time){
        console.log('m triggered')
        var cTime=time

        var p_h = d3.select(container).node().getBoundingClientRect().height+d3.select(container).node().getBoundingClientRect().y;
    


        console.log(margin.down)
        tooltipLine.attr('stroke', 'black')
            .attr('x1', xScale(cTime))
            .attr('x2', xScale(cTime))
            .attr('y2', 0)
            .attr('y1', p_h-margin.down-margin.top-d3.select(container).node().getBoundingClientRect().y)



        var f2s = d3.format(tooltip_format);
        var index = keys[col1].indexOf(cTime);

        tooltipBox.selectAll('*').remove();
        tooltipBoxText=labels[0]+" : " + cTime + " <br/>";
        for(i=0 ;i<data_sets.length;i++)
        {
            tooltipBoxText +=labels[i+1]+": "+f2s(data_sets[i][index][col2])+"<br/>";

        }
        //tooltipBox
        //.attr('transform',`translate(${x},${ height/2})`)
       // d3.mouse(document.body)
        
       //console.log(svg.attr('height'))

        tooltipBox
            .style('display', 'inline')
            .style('left', x-120)
            .style('top', p_h )
            .html(tooltipBoxText)

}

this.addListener=function(l){
    console.log('l added')
    listeners.push(l)
}

}
