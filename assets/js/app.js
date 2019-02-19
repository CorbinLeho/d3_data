// @TODO: YOUR CODE HERE!
var svgWidth = 960;
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
    .domain([d3.min(currentData, d => d[chosenXAxis]) * 0.8,
      d3.max(currentData, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);

  return xLinearScale;

}

// // function used for updating y-scale var upon click on axis label
// function yScale(currentData, chosenYAxis) {
//   // create scales
//   var yLinearScale = d3.scaleLinear()
//     .domain([d3.min(currentData, d => d[chosenYAxis]) * 0.8,
//       d3.max(currentData, d => d[chosenYAxis]) * 1.2
//     ])
//     .range([0, height]);

//   return yLinearScale;

// }

// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

// // function used for updating yAxis var upon click on axis label
// function renderAxes(newYScale, yAxis) {
//   var leftAxis = d3.axisLeft(newYScale);

//   yAxis.transition()
//     .duration(1000)
//     .call(leftAxis);

//   return yAxis;
// }

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXaxis) {

  circlesGroup.transition()
    .duration(3500)
    .attr("cx", d => newXScale(d[chosenXAxis]))
    // .attr("cy", d => newYScale(d[chosenYAxis]));

  return circlesGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, circlesGroup) {

  if (chosenXAxis === "poverty") {
    if (chosenYAxis === "obesity") {
      var label = "Poverty Vs Obesity";
    }
    else if (chosenYAxis === "smokes") {
      var label = "Poverty Vs Smokes";
    }
    else {
      var label = "Poverty Vs Healhcare";
    }
  }
  else if (chosenXAxis === "age") {
    if (chosenYAxis === "obesity") {
      var label = "Age Vs Obesity";
    }
    else if (chosenYAxis === "smokes") {
      var label = "Age Vs Smokes";
    }
    else {
      var label = "Age Vs Healhcare";
    }
  }
  else if (chosenXAxis === "income") {
    if (chosenYAxis === "obesity") {
      var label = "Household Income Vs Obesity";
    }
    else if (chosenYAxis === "smokes") {
      var label = "Household Income Vs Smokes";
    }
    else {
      var label = "Household Income Vs Healhcare";
    }
  }
  else {
    var label = "Unknown";
  }


  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.state}<br>${label} ${d[chosenXAxis]}`);
    });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
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

  // // yLinearScale function above csv import
  // var yLinearScale = yScale(currentData, chosenYAxis);
  
  // Create y scale function
  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(currentData, d => d.obesity)])
    .range([height, 0]);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  chartGroup.append("g")
    .call(leftAxis);
  // var yAxis = chartGroup.append("g")
  // .classed("y-axis", true)
  // .attr("transform", `translate(0, ${width})`)
  // .call(leftAxis);

  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(currentData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d.smokes))
    .attr("r", 20)
    .attr("fill", "blue")
    .attr("opacity", ".4")
    .text(d => d.abbr);

  // Create group for 3 x+y-axis labels
  var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width /2}, ${height + 60})`);

  var povertyLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", -30)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("In Poverty (%)");

  var incomeLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", -10)
    .attr("value", "income") // value to grab for event listener
    .classed("inactive", true)
    .text("Household Income (Median)");

  var ageLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 10)
    .attr("value", "age") // value to grab for event listener
    .classed("inactive", true)
    .text("Age (Median)");

    // var obsityLabel = labelsGroup.append("text")
    // .attr("x", 20)
    // .attr("y", 80)
    // .attr("value", "obsity") // value to grab for event listener
    // .classed("inactive", true)
    // .text("Obsity %");

    // var smokesLabel = labelsGroup.append("text")
    // .attr("x", 40)
    // .attr("y", 100)
    // .attr("value", "smokes") // value to grab for event listener
    // .classed("inactive", true)
    // .text("Smokes %");

    // var healthcareLabel = labelsGroup.append("text")
    // .attr("x", 0)
    // .attr("y", 120)
    // .attr("value", "healthcare") // value to grab for event listener
    // .classed("inactive", true)
    // .text("No Healthcare %");

  // append y axis
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .classed("axis-text", true)
    .text("Obesity");

  // updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

  //  axis labels event listener
  labelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis & value !== ("obsity" || "smokes" || "healthcare")) {

        // replaces chosen Axis with value
        chosenXAxis = value;
        // chosenYAxis = value;

        console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new currentData
        xLinearScale = xScale(currentData, chosenXAxis);

        // updates x axis with transition
        xAxis = renderAxes(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenXAxis === "income") {
          ageLabel
            .classed("active", true)
            .classed("inactive", false);
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else {
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          povertyLabel
            .classed("active", true)
            .classed("inactive", false);
        }
      }
    });
});

