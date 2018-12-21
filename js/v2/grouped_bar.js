
function drawPopGroups() {



    var popGroupsSvgID = "#popGroups"


    var maxHeight = screen.height;
    parentWidth = d3.select(popGroupsSvgID).node().getBoundingClientRect().width;
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



    var ratioText;

    var margin = 40
        , width = width - 2 * margin
        , height = (height * 0.75) - 2 * margin;


    var tooltipBox = d3.select(popGroupsSvgID).append('div')
        .style('position', 'absolute')
        .style('background', 'lightgray')
        .style('padding', '5px')

    var popGroupsSvg = d3.select(popGroupsSvgID).append('svg')
        .attr('width', width + 2 * margin)
        .attr('height', height + 2 * margin)
        .append('g')
        .attr('transform', `translate(${margin},${margin})`)


    ratioText = popGroupsSvg.append('text').attr('x', width / 10).attr('y', height / 2).attr('style', 'display:none');




    var x0 = d3.scaleBand()
        .rangeRound([0, width])
        .paddingInner(0.2);

    var x1 = d3.scaleBand()
        .paddingInner(0.1)
        .paddingOuter(0.3)

    var x2 = d3.scaleBand()
        .paddingInner(0.1)
        .paddingOuter(0.3)

    var y = d3.scaleLinear()
        .rangeRound([height, 0]);

    var z = d3.scaleOrdinal()
        .range(["#0000FF", "#FFC0CB", "#0000FF", "#FFC0CB", "#a05d56", "#d0743c", "#ff8c00"]);

    d3.csv("ad_pop_gender.csv")
        .then(function (data) {


            //console.log(data)



            var keys = data.columns.slice(1)
            x0.domain(data.map(function (d) { return d.year }));
            x1.domain(keys.slice(0, 2)).rangeRound([0, x0.bandwidth() / 2]);
            x2.domain(keys.slice(2, 4)).rangeRound([x0.bandwidth() / 2, x0.bandwidth()]);
            y.domain([0, 2000000]);

            popGroupsSvg.append("g")
                .selectAll("g")
                .data(data)
                .enter().append("g")
                .attr("transform", function (d) { /*console.log(d.year);*/ return "translate(" + x0(d.year) + ",0)"; })
                .selectAll("rect")
                .data(function (d) { return keys.map(function (key) { return { key: key, value: d[key] }; }); })
                .enter().append("rect")
                .attr("x", function (d, i) {
                    if (i == 0 || i == 1) {
                        //console.log('one')
                        return x1(d.key);

                    }
                    else { console.log('two'); return x2(d.key); }

                })
                .on('mouseover', function (d, i) {
                    // console.log(d)
                    curBar = d;
                    console.log(d3.mouse(this));
                    //d3.select(this).attr('fill','red');
                    var nexBar = null;
                    var nexBarValue = 0;
                    var maleFemaleRatio = 0;
                    if (i == 0) {
                        d3.select(this.parentNode).selectAll('rect').filter(function (d, i) { if (i == 1) { nexBar = d3.select(this); nexBarValue = d }; })
                        maleFemaleRatio = curBar.value / nexBarValue.value
                    }
                    if (i == 1) {
                        d3.select(this.parentNode).selectAll('rect').filter(function (d, i) { if (i == 0) { nexBar = d3.select(this); nexBarValue = d }; })
                        maleFemaleRatio = nexBarValue.value / curBar.value
                    }
                    if (i == 2) {
                        d3.select(this.parentNode).selectAll('rect').filter(function (d, i) { if (i == 3) { nexBar = d3.select(this); nexBarValue = d }; })
                        maleFemaleRatio = curBar.value / nexBarValue.value
                    }
                    if (i == 3) {
                        d3.select(this.parentNode).selectAll('rect').filter(function (d, i) { if (i == 2) { nexBar = d3.select(this); nexBarValue = d }; })
                        maleFemaleRatio = nexBarValue.value / curBar.value
                    }

                    // console.log(curBar);
                    //console.log(nexBar);
                    //console.log(maleFemaleRatio)
                    //nexBar.attr("fill", "red");

                    tooltipBox
                        .style('display', 'inline')
                        .html(curBar.value)
                        .style('left',d3.mouse(this.parentNode.parentNode)[0] )
                        .style('top', d3.mouse(this.parentNode.parentNode)[1] +50 )


                    var eachBand = x0.step();
                    var index = Math.floor((d3.mouse(this.parentNode.parentNode)[0]) / eachBand);
                    var val = x0.domain()[index];


                    //console.log(curBar.key)

                    f2s = d3.format('.2s');

                    var nationality = '';

                    if (curBar.key == 'male_local' || curBar.key == 'female_local') nationality = 'local'
                    else nationality = 'foreign'



                    //ratioText.text('In ' + val + " There were " + f2s(maleFemaleRatio) + " "+nationality+ " males for every "+nationality+" female").attr('style', 'display:inline')

                    ratioText.text(null)
                        .append('tspan').attr('x', width/5).attr('y', height/3).attr('dy', 0.71 + 'em').text('In ' + val + " There were " + f2s(maleFemaleRatio) + " " + nationality + " males ")
                        .append('tspan').attr('x', width/5).attr('y', height/3+10).attr('dy', 1 + 'em').text("for every " + nationality + " female");
                    ratioText.attr('style', 'display:inline')

                })
                .on('mouseout',function(){
                    tooltipBox.style('display','none');
                    ratioText.text(null)
                })
                .attr("y", function (d) { return y(d.value); })
                .attr("width", x1.bandwidth())
                .attr("height", function (d) { /*console.log(d.value);*/ return height - y(d.value); })
                .attr("fill", function (d) { return z(d.key); });

            popGroupsSvg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x0));


            popGroupsSvg.selectAll(".tick text")
                .each(function (t, i) {

                    var text = d3.select(this);

                    lineHeight = 1 * 2,
                        textY = text.attr("y"),
                        textDy = parseFloat(text.attr("dy"));

                    prevText = text.text();
                    textX = x0.bandwidth() * 0.3;
                    text.text(null)
                        .append('tspan').attr('x', 0).attr('y', textY).attr('dy', lineHeight + 'em').text(prevText)
                        .append('tspan').attr('x', -1 * textX).attr('y', textY).attr('dy', textDy + 'em').text('Local')
                        .append('tspan').attr('x', textX).attr('y', textY).attr('dy', textDy + 'em').text('Foreign')



                })






            popGroupsSvg.append("g")
                .attr("class", "axis")
                .call(d3.axisLeft(y).ticks(null, "s"))
                .append("text")
                .attr("x", 2)
                .attr("y", y(y.ticks().pop()) + 0.5)
                .attr("dy", "0.32em")
                .attr("fill", "#000")
                .attr("font-weight", "bold")
                .attr("text-anchor", "start")
                .text("Population");

            var legend = popGroupsSvg.append("g")
                .attr("font-family", "sans-serif")
                .attr("font-size", 10)
                .attr("text-anchor", "end")
                .selectAll("g")
                .data(keys.slice(0, 2).reverse())
                .enter().append("g")
                .attr("transform", function (d, i) { return "translate(0," + i * 20 + ")"; });

            legend.append("rect")
                .attr("x", width - 19)
                .attr("width", 19)
                .attr("height", 19)
                .attr("fill", z);

            legend.append("text")
                .attr("x", width - 24)
                .attr("y", 9.5)
                .attr("dy", "0.32em")
                .text(function (d, i) {
                    if (i == 0) return 'Female'
                    else return 'Male'
                });



        });



    function wrap(text, width) {

    }

    function getMethods(obj) {
        var res = [];
        for (var m in obj) {
            if (typeof obj[m] == "function") {
                res.push(m)
            }
        }
        return res;
    }
}

drawPopGroups();
