var year;
var state;
var dataset = new Array();
var sum;
var track = 0;


function getYear() {
year = d3.select("#myRange").property("value");
dataset = new Array();
d3.select(".yearHead").select("h2")
  .text(year);

  setData();
}

function scrollLanding() {
    var h = window.innerHeight;
    window.scrollTo(0, h);
}

function getState() {
  state = event.srcElement.id;
  d3.select(".stateHead").select("h2")
  .text(state);

  getYear();
}

function setData() {

  $.ajax({
    url: "https://data.cdc.gov/resource/u4d7-xz8k.json?$where=year = "+year+"&state="+state+"",
    type: "GET",
    data: {
      "$limit" : 5000,
      "$$app_token" : "KfPXeWRyFx9V5TmvRttOfIaiV"
    }
}).done(function(data) {
  //alert("Retrieved " + data.length + " records from the dataset!");
  console.log(data);
track++;
  for(var i = 0; i <= data.length -1; i++) {
    if(data[i]. _113_cause_name == "All Causes") {
      continue;
    } else {
  var num = Number(data[i].deaths);
  var name = String(data[i].cause_name);
  dataset.push({"name": name, "value": num});
  
    }
  }
    
    console.log(dataset);
    chartCreate()

});
}

function chartCreate() {
  if(track == 1) {
    showChart();
  } else {
    d3.select("svg").remove();
    showChart();
  }
}

function showChart() {
  console.log(track);
  var data = dataset;
  data.sort((a, b) => (a.name > b.name) ? 1 : -1);

  // set the dimensions and margins of the graph
  var margin = {top: 20, right: 120, bottom: 30, left: 170},
  width = 1100 - margin.left - margin.right,
  height = 600 - margin.top - margin.bottom;


  // set the ranges
  var y = d3.scaleBand()
        .range([height, 0])
        .padding(0.1);

  var x = d3.scaleLinear()
        .range([0, width]);
        
  // append the svg object to the body of the page
  // append a 'group' element to 'svg'
  // moves the 'group' element to the top left margin
  var svg = d3.select("#graphic").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", 
        "translate(" + margin.left + "," + margin.top + ")");

        var h = window.innerHeight;
      window.scrollTo(0, h);
  // format the data
  data.forEach(function(d) {
    d.value = +d.value;
  });

  // Scale the range of the data in the domains
  x.domain([0, d3.max(data, function(d){ return d.value; })])
  y.domain(data.map(function(d) { return d.name; }));
  //y.domain([0, d3.max(data, function(d) { return d.sales; })]);

  // append the rectangles for the bar chart
  var bar = svg.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("width", 0)//this is the initial value
      .transition()
      .duration(800)//time in ms
      .delay(function(d,i){ return i*200})
      .attr("width", function(d) {return x(d.value); } )
      .attr("y", function(d) { return y(d.name); })
      .attr("height", y.bandwidth())
      .style("stroke", "#c0ccd4")
      .style("fill-opacity", .2) // set the fill opacity
      .style("fill", "#c0ccd4")  // set the fill colour

  // add the x Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .attr("class", "axis")
      .call(d3.axisBottom(x));

  // add the y Axis
  svg.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(y));
}
  
function compare(){

  var svg = d3.select("#graphic2").append("svg")
  .attr("width", 900)
  .attr("height", 600)


  

    var path = d3.geoPath();
    d3.json("https://d3js.org/us-10m.v1.json", function(error, us) {
      if (error) throw error;
      svg.append("g")
          .attr("class", "states")
        .selectAll("path")
        .data(topojson.feature(us, us.objects.states).features)
        .enter().append("path")
          .attr("d", path);
      svg.append("path")
          .attr("class", "state-borders")
          .attr("d", path(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; })));
    });
}





