var year;
var state;
var dataset = new Array();
var dataset2 = new Array();
var dataset3 = new Array();
var sum;
var track = 0;
var track2 = 0;
var track3 = 0;
var track4 = 0;
var states = {
  "01": "Alabama",
  "02": "Alaska",
  "04": "Arizona",
  "05": "Arkansas",
  "06": "California",
  "08": "Colorado",
  "09": "Connecticut",
  "10": "Delaware",
  "12": "Florida",
  "13": "Georgia",
  "15": "Hawaii",
  "16": "Idaho",
  "17": "Illinois",
  "18": "Indiana",
  "19": "Iowa",
  "20": "Kansas",
  "21": "Kentucky",
  "22": "Louisiana",
  "23": "Maine",
  "24": "Maryland",
  "25": "Massachusetts",
  "26": "Michigan",
  "27": "Minnesota",
  "28": "Mississippi",
  "29": "Missouri",
  "30": "Montana",
  "31": "Nebraska",
  "32": "Nevada",
  "33": "New Hampshire",
  "34": "New Jersey",
  "35": "New Mexico",
  "36": "New York",
  "37": "North Carolina",
  "38": "North Dakota",
  "39": "Ohio",
  "40": "Oklahoma",
  "41": "Oregon",
  "42": "Pennsylvania",
  "44": "Rhode Island",
  "45": "South Carolina",
  "46": "South Dakota",
  "47": "Tennessee",
  "48": "Texas",
  "49": "Utah",
  "50": "Vermont",
  "51": "Virginia",
  "53": "Washington",
  "54": "West Virginia",
  "55": "Wisconsin",
  "56": "Wyoming"
}

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

  var tooltip = d3.select('body').append('div')
  .attr('class', 'tooltip')
  .style('opacity', 0);

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
      .attr("y", function(d) { return y(d.name); })
      .attr("height", y.bandwidth())
      .style("stroke", "#c0ccd4")
      .style("fill-opacity", .2) // set the fill opacity
      .style("fill", "#c0ccd4")  // set the fill colour
      .on('mouseover', (d) => {
        tooltip.transition().duration(200).style('opacity', 0.9);
        tooltip.html(`Deaths: <span>${d.value}</span>`)
          .style('left', `${d3.event.layerX}px`)
          .style('top', `${(d3.event.layerY - 28)}px`);
      })
      .on('mouseout', () => tooltip.transition().duration(500).style('opacity', 0)) 

      bar.transition()
  .duration(1000)
  .attr("width", function(d) {
    return x(d.value)
  })
     
     

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


  d3.select(".stateSlide").append("input")
  .attr("min", 1999)
  .attr("max", 2016)
  .attr("class", "slider")
  .attr("value", d3.select("#myRange").property("value"))
  .attr("id", "myRange2")
  .attr("type", "range")
  .attr("onchange", "map()");

  document.getElementById("compButt").disabled = true; 
}
  function map() {

    d3.select(".yearslide").select("h2")
  .text(d3.select("#myRange2").property("value"));
  

  d3.select("#graphic2").select("svg").remove().exit();
  var svg = d3.select("#graphic2").append("svg")
  .attr("width", 950)
  .attr("height", 600)

  var path = d3.geoPath();
    d3.json("https://d3js.org/us-10m.v1.json").then(function(us) {
      svg.append("g")
        .attr("class", "states")
        .selectAll("path")
        .data(topojson.feature(us, us.objects.states).features)
        .enter()
        .append("path")
        .attr("d", path)
        .on("mousedown", function (d) {

          
          var tooltip = d3.select('body').append('div')
          .attr('class', 'tooltip')
          .style('opacity', 0);

          var state2 = states[d.id];
          var year2 = d3.select("#myRange2").property("value");

          if(track2 == 0) {

            if(track3 == 1){
              d3.select("#d3Id").select("svg").remove().exit();
              track3 = 0;
              dataset2 = new Array();
            }
            
          $.ajax({
            url: "https://data.cdc.gov/resource/u4d7-xz8k.json?$where=year = "+year2+"&state="+state2+"",
            type: "GET",
            data: {
              "$limit" : 5000,
              "$$app_token" : "KfPXeWRyFx9V5TmvRttOfIaiV"
            }
        }).done(function(data) {
          //alert("Retrieved " + data.length + " records from the dataset!");
          //console.log(data);
          track2++;
          track3++;
          for(var i = 0; i <= data.length -1; i++) {
            if(data[i]. _113_cause_name == "All Causes") {
              continue;
            } else {
          var num = Number(data[i].deaths);
          var name = String(data[i].cause_name);
          dataset2.push({"name": name, "value": num});
         
          
            }
          }
      
          var data = dataset2;
          data.sort((a, b) => (a.name > b.name) ? 1 : -1);
        
          // set the dimensions and margins of the graph
          var margin = {top: 60, right: 165, bottom: 30, left: 60},
          width = 550,
          height = 350;
        
                // set the ranges
                var y = d3.scaleBand()
                .range([height, 0])
                .padding(0.1);

                var x = d3.scaleLinear()
                  .range([width, 0]);

                  var x2 = d3.scaleLinear()
                  .range([width, 0]);
                  
                // append the svg object to the body of the page
                // append a 'group' element to 'svg'
                // moves the 'group' element to the top left margin
                var svg = d3.select("#d3Id").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", 
                  "translate(" + margin.left + "," + margin.top + ")");

                data.forEach(function(d) {
                d.value = +d.value;
                });

                svg.append("text")
                .attr("x", (width / 2))             
                .attr("y", 0 - (margin.top / 2))
                .attr("text-anchor", "middle")  
                .style("font-size", "30px") 
                .attr("font-family", "'Oswald', sans-serif")
                .attr("fill", "floralwhite")
                .text(state2);

          // Scale the range of the data in the domains
          x.domain([d3.max(data, function(d){ return d.value; }), 0])
          x2.domain([0, d3.max(data, function(d){ return d.value; })])
          y.domain(data.map(function(d) { return d.name; }));
          //y.domain([0, d3.max(data, function(d) { return d.sales; })]);

          var bar = svg.selectAll(".bar")
          .data(data)
          .enter().append("rect")
          .attr("class", "bar")
          .attr("width", 0)//this is the initial value
          .attr("x", function(d) { return width-x(d.value); })
          .attr("y", function(d) { return y(d.name); })
          .attr("height", y.bandwidth())
          .style("stroke", "#c0ccd4")
          .style("fill-opacity", .2) // set the fill opacity
          .style("fill", "#c0ccd4")  // set the fill colour
          .on('mouseover', (d) => {
            tooltip.transition().duration(200).style('opacity', 0.9);
            tooltip.html(`Deaths: <span>${d.value}</span>`)
              .style('left', `${d3.event.layerX}px`)
              .style('top', `${(d3.event.layerY - 28)}px`);
          })
          .on('mouseout', () => tooltip.transition().duration(500).style('opacity', 0)) 
    
          bar.transition()
          .duration(1000)
          .attr("width", function(d) {
          return x(d.value)
          })
          // add the x Axis
          svg.append("g")
          .attr("transform", "translate(0," + height + ")")
          .attr("class", "axis")
          .call(d3.axisBottom(x2));

          // add the y Axis
          svg.append("g")
          .attr("class", "axis")
          .attr('transform', 'translate(' + (550) + ', 0)')
          .call(d3.axisRight(y));
        });
      } else {

        if(track4 == 1) {
          d3.select("#d2").select("svg").remove().exit();
          track4 = 0;
          dataset3 = new Array();
        }

        $.ajax({
          url: "https://data.cdc.gov/resource/u4d7-xz8k.json?$where=year = "+year2+"&state="+state2+"",
          type: "GET",
          data: {
            "$limit" : 5000,
            "$$app_token" : "KfPXeWRyFx9V5TmvRttOfIaiV"
          }
      }).done(function(data) {
        //alert("Retrieved " + data.length + " records from the dataset!");
        //console.log(data);
        track2 = 0;
        track4++;
        for(var i = 0; i <= data.length -1; i++) {
          if(data[i]. _113_cause_name == "All Causes") {
            continue;
          } else {
        var num = Number(data[i].deaths);
        var name = String(data[i].cause_name);
        dataset3.push({"name": name, "value": num});
          }
        }

        dataset3.sort((a, b) => (a.name > b.name) ? 1 : -1);
        console.log(dataset3);
      
        var data = dataset3;
        data.sort((a, b) => (a.name > b.name) ? 1 : -1);
      
        // set the dimensions and margins of the graph
        var margin = {top: 60, right: 150, bottom: 30, left: 9},
        width = 550,
        height = 350;
      
              // set the ranges
              var y = d3.scaleBand()
              .range([height, 0])
              .padding(0.1);

              var x = d3.scaleLinear()
                .range([0, width]);
                
              // append the svg object to the body of the page
              // append a 'group' element to 'svg'
              // moves the 'group' element to the top left margin
              var svg = d3.select("#d2").append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              .append("g")
              .attr("transform", 
                "translate(" + margin.left + "," + margin.top + ")");

              // format the data
              data.forEach(function(d) {
              d.value = +d.value;
              });

              svg.append("text")
                .attr("x", (width / 2))             
                .attr("y", 0 - (margin.top / 2))
                .attr("text-anchor", "middle")  
                .style("font-size", "30px") 
                .attr("font-family", "'Oswald', sans-serif")
                .attr("fill", "floralwhite")
                .text(state2);

        // Scale the range of the data in the domains
        x.domain([0, d3.max(data, function(d){ return d.value; })])
        y.domain(data.map(function(d) { return d.name; }));
        //y.domain([0, d3.max(data, function(d) { return d.sales; })]);

        var bar = svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("width", 0)//this is the initial value
        .attr("y", function(d) { return y(d.name); })
        .attr("height", y.bandwidth())
        .style("stroke", "#c0ccd4")
        .style("fill-opacity", .2) // set the fill opacity
        .style("fill", "#c0ccd4")  // set the fill colour
        .on('mouseover', (d) => {
          tooltip.transition().duration(200).style('opacity', 0.9);
          tooltip.html(`Deaths: <span>${d.value}</span>`)
            .style('left', `${d3.event.layerX}px`)
            .style('top', `${(d3.event.layerY - 28)}px`);
        })
        .on('mouseout', () => tooltip.transition().duration(500).style('opacity', 0)) 
  
        bar.transition()
        .duration(1000)
        .attr("width", function(d) {
        return x(d.value)
        })

        // add the x Axis
        svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .attr("class", "axis")
        .call(d3.axisBottom(x));
        // add the y Axis
        svg.append("g")
          .attr("class", "axis")
          .call(d3.axisLeft(y));


      });
      }
      });
    
      svg.append("path")
        .attr("class", "state-borders")
        .attr("d", path(topojson.feature(us, us.objects.states, function(a, b) { return a !== b; })))
      });

      scrollLanding();
    }

  
    




