function drawPyramid(data, labels, colors, classes, container) {

    var parentDiv = container


    var maxHeight = screen.height;
    var parentWidth = d3.select(parentDiv).node().getBoundingClientRect().width;
    var height = 0;
    var width = 0
    var keys = data.columns.slice(1, data.columns.length);


    var minWidth = 400;

    if (parentWidth < minWidth) {
        parentWidth = minWidth
    }

    if (0.75 * parentWidth > 0.75 * maxHeight) {
        height = 0.75 * maxHeight;
        width = 1.34 * height;

    }

    else {

        width = parentWidth
        height = parentWidth;

    }



    var margin = { top: 10, down: 70, right: 80, left: 80 }
        , width = width - margin.right - margin.left
        , height = (height * 0.75) - margin.top - margin.down
        , gutter = 30
        , pyramid_h = height
        , cx = width / 2
        , axisFormatter = d3.format('.2s')
        , labelFormatter = d3.format(',d');


    var popRange = (width - gutter - gutter) / 2;
    var axisMargin = 25;




    var svg = d3.select(parentDiv).append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.down)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    var svg_text_m = svg.append('text')
        .attr('transform', `translate(${cx + width / 3},${10})`)
        .style('font', '15px sans-serif')
        .attr('text-anchor', 'start')

    var svg_text_f = svg.append('text')
        .attr('transform', `translate(${cx - width / 3},${10})`)
        .style('font', '15px sans-serif')
        .attr('text-anchor', 'end');

    var svg_text_t = svg.append('text')
        .attr('transform', `translate(${cx},${pyramid_h + 55})`)
        .style('font', '15px sans-serif')
        .attr('text-anchor', 'middle');



    // age axis
    var s_age = d3.scaleBand()
        .domain(data.columns.slice(1, data.columns.length))
        .range([pyramid_h, 0]);

    var ax_ageـl = d3.axisLeft(s_age)
        //.ticks(15)
        .tickFormat(String)



    var ax_age_svg_l = svg.append('g')
        .attr('class', 'axis age')
        .attr('transform', `translate(${cx - gutter / 2 + axisMargin},0)`)
        .call(ax_ageـl)
        .selectAll('text')
        .attr('x', -gutter / 2 - 10)
        .style('text-anchor', 'middle');

    var ax_age_r = d3.axisRight(s_age)
        //.ticks(15)
        .tickFormat(d => '');



    var ax_age_svg_r = svg.append('g')
        .attr('class', 'axis age')
        .attr('transform', `translate(${cx - gutter / 2 - axisMargin},0)`)
        .call(ax_age_r);


    // population scale 

    var popRange = (width - gutter - gutter) / 2;


    // computer X domain
    var values = []
    for (i = 0; i < keys.length; i++) {
        values.push(data[0][keys[i]]);
        values.push(data[1][keys[i]]);
    }

    // find the yscale domin
    var divider = parseFloat(1.0);
    while ((Math.max(...values) / divider) > 10) {
        divider = divider * 10
    }
    xDomainVal = Math.ceil(Math.max(...values) / divider) * divider;

    var s_male = d3.scaleLinear()
        .domain([0, xDomainVal])
        .range([0, popRange]);

    var s_female = d3.scaleLinear()
        .domain([xDomainVal, 0])
        .range([0, popRange]);


    var ax_male = d3.axisBottom(s_male)
        .ticks(5)
        .tickFormat(axisFormatter);

    var ax_female = d3.axisBottom(s_female)
        .ticks(5)
        .tickFormat(axisFormatter);

    svg.append('g')
        .attr('class', 'axis')
        .attr('transform', `translate(${cx + gutter},${pyramid_h + 5})`)
        .call(ax_male)

    svg.append('g')
        .attr('class', 'axis population')
        .attr('transform', `translate(${cx - gutter - axisMargin - popRange},${pyramid_h + 5})`)
        .call(ax_female);




    var male_values = [];
    var female_values = [];
    for (i = 0; i < keys.length; i++) {
        male_values.push(data[0][keys[i]]);
        female_values.push(data[1][keys[i]]);
    }


    var maleSum = male_values.reduce((a, b) => parseInt(a) + parseInt(b), 0);
    var femaleSum = female_values.reduce((a, b) => parseInt(a) + parseInt(b), 0)





    lineHeight = 1 * 2,
        textY = svg_text_m.attr("y"),
        textDy = parseFloat(svg_text_m.attr("dy"));

    svg_text_m.text(null)
        .append('tspan').attr('x', 0).attr('y', textY).attr('dy', 0.71 + 'em').text(labels[1])
        .append('tspan').attr('x', 0).attr('y', textY).attr('dy', 1 + 'em').text(labelFormatter(maleSum))

    svg_text_f.text(null)
        .append('tspan').attr('x', 0).attr('y', textY).attr('dy', 0.71 + 'em').text([labels[2]])
        .append('tspan').attr('x', 0).attr('y', textY).attr('dy', 1 + 'em').text(labelFormatter(femaleSum))


    svg_text_t.text("Total local population in 2016 : " + labelFormatter(maleSum + femaleSum))







    //console.log(male_values);
    var male_bars = svg.append('g').selectAll('rect')
        .data(male_values)
        .enter()
        .append('rect')
        .attr('class', classes[0])
        .style('fill', colors[0])
        .attr('width', d => s_male(parseInt(d)))
        .attr('height', s_age.step() * 0.7)
        .attr('x', cx + gutter)
        .attr('y', (d, i) => s_age(keys[i]))
    //.on('mouseover', (d, i) => handleMouseOver(d, i))
    //.on('mouseout', (d, i) => handleMouseOut(d, i))


    var female_bars = svg.append('g').selectAll('rect')
        .data(female_values)
        .enter()
        .append('rect')
        .attr('class', classes[1])
        .style('fill', colors[1])
        .attr('width', d => s_female(0) - s_female(parseInt(d)))
        .attr('height', s_age.step() * 0.7)
        .attr('x', d => cx - gutter - axisMargin - (s_female(0) - s_female(parseInt(d))))
        .attr('y', (d, i) => s_age(keys[i]))
    // .on('mouseover', (d, i) => handleMouseOver(d, i))
    // .on('mouseout', (d, i) => handleMouseOut(d, i))

    svg.append('g').selectAll('rect')
        .data(male_values)
        .enter()
        .append('rect')
        .attr('width', width)
        .attr('height', 20)
        .attr('x', 0)
        .attr('y', (d, i) => s_age(keys[i]))
        .style('opacity', '0')
        .on('mouseover', (d, i) => handleMouseOver(d, i))
        .on('mouseout', (d, i) => handleMouseOut(d, i))



    var male_texts = svg.append('g').selectAll('rect')
        .data(male_values)
        .enter()
        .append('text')
        .attr('x', d => cx + gutter + s_male(parseInt(d)) + 5)
        .attr('y', (d, i) => s_age(keys[i]) + (s_age.step() * 0.7))
        .style('display', 'none')
        .attr('class', parentDiv + "mtexts")
        .style('font', '13px sans-serif')



    var female_texts = svg.append('g').selectAll('rect')
        .data(female_values)
        .enter()
        .append('text')
        .attr('x', d => cx - gutter - axisMargin - (s_female(0) - s_female(parseInt(d))) - 50)
        .attr('y', (d, i) => s_age(keys[i]) + (s_age.step() * 0.7))
        .style('display', 'none')
        .attr('class', parentDiv + "ftexts")
        .style('font', '13px sans-serif')








    function handleMouseOver(d, i) {


        maleBar = d3.select(male_bars.selectAll('rect')._parents[i]).style('fill', 'orangered');
        femaleBar = d3.select(female_bars.selectAll('rect')._parents[i]).style('fill', 'orangered');
        maleText = d3.select(male_texts.selectAll('text')._parents[i]).text(labelFormatter(maleBar._groups[0][0].__data__)).style('display', 'inline');
        femaleText = d3.select(female_texts.selectAll('text')._parents[i]).text(labelFormatter(femaleBar._groups[0][0].__data__)).style('display', 'inline');

    }

    function handleMouseOut(d, i) {

        maleBar = d3.select(male_bars.selectAll('rect')._parents[i]).style('fill', colors[0]);
        femaleBar = d3.select(female_bars.selectAll('rect')._parents[i]).style('fill', colors[1]);
        maleText = d3.select(male_texts.selectAll('text')._parents[i]).text(labelFormatter(maleBar._groups[0][0].__data__)).style('display', 'none');
        femaleText = d3.select(female_texts.selectAll('text')._parents[i]).text(labelFormatter(femaleBar._groups[0][0].__data__)).style('display', 'none');



    }









}
