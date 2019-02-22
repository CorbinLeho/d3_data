// @TODO: YOUR CODE HERE!
var svgWidth = 800;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 100,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "smokes"

// function used for updating x-scale var upon click on axis label
function xScale(currentData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(currentData, d => d[chosenXAxis] * .8),
      d3.max(currentData, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);

  return xLinearScale;

}

// function used for updating y-scale var upon click on axis label
function yScale(currentData, chosenYAxis) {
  // create scales
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(currentData, d => d[chosenYAxis] * 8),
      d3.max(currentData, d => d[chosenYAxis]) * 1.2
    ])
    .range([height, 0]);

  return yLinearScale;

}

// var newXScale = ""
// var newYScale = ""

// function used for updating xAxis var upon click on axis label
function xrenderAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(3500)
    .call(bottomAxis);

  return xAxis;
}

// function used for updating yAxis var upon click on axis label
function yrenderAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(3500)
    .call(leftAxis);

  return yAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {

  circlesGroup.transition()
    .duration(3500)
    .attr("cx", d => newXScale(d[chosenXAxis]))
    .attr("cy", d => newYScale(d[chosenYAxis]));

  return circlesGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

  if (chosenXAxis === "poverty") {
    var xlabel = "Poverty %"
    if (chosenYAxis === "obesity") {
      var ylabel = "Obesity %";
    }
    else if (chosenYAxis === "smokes") {
      var ylabel = "Smokes %";
    }
    else {
      var ylabel = "No Healhcare %";
    }
  }
  else if (chosenXAxis === "age") {
    var xlabel = "Age (Meadian)"
    if (chosenYAxis === "obesity") {
      var ylabel = "Obesity %";
    }
    else if (chosenYAxis === "smokes") {
      var ylabel = "Smokes %";
    }
    else {
      var ylabel = "No Healhcare %";
    }
  }
  else if (chosenXAxis === "income") {
    var xlabel = "Household income (Median)"
    if (chosenYAxis === "obesity") {
      var ylabel = "Obesity %";
    }
    else if (chosenYAxis === "smokes") {
      var ylabel = "Smokes %";
    }
    else {
      var ylabel = "No Healhcare %";
    }
  }
  else {
    var ylabel = "idk"
    var xlabel = "idk";
  }


  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([0, 0])
    .html(function(d) {
      return (`${d.state}<br>${xlabel} ${d[chosenXAxis]}<br>${ylabel} ${d[chosenYAxis]}`);
    });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(d) {
    toolTip.show(d);
  })
    // onmouseout event
    .on("mouseout", function(d) {
      toolTip.hide(d);
    });

  return circlesGroup;
}

// Retrieve currentData from the CSV file and execute everything below
d3.csv("assets/data/data.csv").then(function(currentData) {

  console.log(currentData)
  // parse currentData
  currentData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.age = +data.age;
    data.income = +data.income;
    data.healthcare = +data.healthcare;
    data.obesity = +data.obesity;
    data.smokers = +data.smokers;
  });


  // xLinearScale function above csv import
  var xLinearScale = xScale(currentData, chosenXAxis);

  // yLinearScale function above csv import
  var yLinearScale = yScale(currentData, chosenYAxis);
  
  // // Create y scale function
  // var yLinearScale = d3.scaleLinear()
  //   .domain([0, d3.max(currentData, d => d.obesity)])
  //   .range([height, 0]);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  var yAxis = chartGroup.append("g")
  .classed("y-axis", true)
  .attr("transform", `translate(0, ${width})`)
  .call(leftAxis);

  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(currentData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 20)
    .attr("fill", "blue")
    .attr("opacity", ".4")
    .text(d => d.abbr);

  // Create group for 3 x-axis labels
  var xlabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width /2}, ${height + 60})`);

      var povertyLabel = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", -30)
        .attr("value", "poverty") // value to grab for event listener
        .classed("active", true)
        .text("In Poverty (%)");

      var incomeLabel = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", -10)
        .attr("value", "income") // value to grab for event listener
        .classed("inactive", true)
        .text("Household Income (Median)");

      var ageLabel = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 10)
        .attr("value", "age") // value to grab for event listener
        .classed("inactive", true)
        .text("Age (Median)");


      // Create group for 3 y-axis labels
  var ylabelsGroup = chartGroup.append("g")
  .attr("transform", "rotate(-90)", `translate(${width + 60}, ${height / 2})`);

      var obsityLabel = ylabelsGroup.append("text")
      .attr("x", -150)
      .attr("y", -30)
      .attr("value", "obsity") // value to grab for event listener
      .classed("inactive", true)
      .text("Obsity %");

      var smokesLabel = ylabelsGroup.append("text")
      .attr("x", -150)
      .attr("y", -50)
      .attr("value", "smokes") // value to grab for event listener
      .classed("inactive", true)
      .text("Smokes %");

      var healthcareLabel = ylabelsGroup.append("text")
      .attr("x", -150)
      .attr("y", -70)
      .attr("value", "healthcare") // value to grab for event listener
      .classed("inactive", true)
      .text("No Healthcare %");



  // updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

  //  axis labels event listener
  xlabelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {

        // replaces chosen Axis with value
        chosenXAxis = value;
        chosenYAxis = value;

        console.log(chosenXAxis)
        console.log(chosenYAxis)

        // functions here found above csv import
        // updates x scale for new currentData
        xLinearScale = xScale(currentData, chosenXAxis);

        // updates x axis with transition
        xAxis = xrenderAxes(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, newXScale, newYScale, chosenXAxis, chosenYAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, chosenYaxis, circlesGroup);

        // changes classes to change bold text
        if (chosenXAxis === "income") {
          incomeLabel
            .classed("active", true)
            .classed("inactive", false);
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else if (chosenXaxis === "age") {
          ageLabel
            .classed("active", true)
            .classed("inactive", false);
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else {
          povertyLabel
            .classed("active", true)
            .classed("inactive", false);
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);
        }
      }
    });
  //  axis labels event listener
  ylabelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenYAxis) {

        // replaces chosen Axis with value
        chosenYAxis = value;
        // chosenYAxis = value;

        console.log(chosenYAxis)

        // functions here found above csv import
        // updates y scale for new currentData
        yLinearScale = yScale(currentData, chosenYAxis);

        // updates y axis with transition
        yAxis = yrenderAxes(yLinearScale, yAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, newXScale, newYScale, chosenXAxis, chosenYAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, chosenYaxis, circlesGroup);

        // changes classes to change bold text
        if (chosenXAxis === "obsity") {
          obsityLabel
            .classed("active", true)
            .classed("inactive", false);
          smokesLabel
            .classed("active", false)
            .classed("inactive", true);
          healthcareLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else if (chosenXaxis === "smokes") {
          smokesLabel
            .classed("active", true)
            .classed("inactive", false);
          obsityLabel
            .classed("active", false)
            .classed("inactive", true);
          healthcareLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else {
          healthcareLabel
            .classed("active", true)
            .classed("inactive", false);
          obsityLabel
            .classed("active", false)
            .classed("inactive", true);
          smokesLabel
            .classed("active", false)
            .classed("inactive", true);
        }
      }
    });
});

