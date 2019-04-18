//track year from slider
var year;
//track main state
var state;
//main dataset for intial graph and comparisons
var dataset = new Array();
//track second layer data
var dataset2 = new Array();
//track third layer data
var dataset3 = new Array();
//tracks percentages taken from both datasets
var percentage = new Array(10);
var percentage3 = new Array(10);
//track second state for comparison
var state2;
//track to prevent conclusion from producing twice
var cp = 0;
//track to prevent buttons from producing twice
var buttonTrack = 0;
//track update percentages 
var count = 0;
//tracks for each update
var updatetrack = 0;
var track = 0;
var track2 = 0;
var track3 = 0;
var track4 = 0;
//array with states ANSI codes for matching with topoJSON
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

//get initial year from slider and assign header
function getYear() {
  year = d3.select("#myRange").property("value");
  dataset = new Array();
  d3.select(".yearHead").select("h2")
  .text(year);
  setData();
}

//scroll on enter from landing page
function scrollLanding() {
  var h = window.innerHeight;
  window.scrollTo(0, h);
}

//get initial state from dropdown and assign header
function getState() {
  state = event.srcElement.id;
  d3.select(".stateHead").select("h2")
  .text(state);
  getYear();
}

//set the inital data, pull from CDC API based on state and year
function setData() {
  $.ajax({
    url: "https://data.cdc.gov/resource/u4d7-xz8k.json?$where=year = "+year+"&state="+state+"",
    type: "GET",
    data: {
      "$limit" : 5000,
      "$$app_token" : "KfPXeWRyFx9V5TmvRttOfIaiV"
    }
  }).done(function(data) {
    //track chart creation
    track++;
    //loop through pulled data excluding All Causes 
    for(var i = 0; i <= data.length -1; i++) {
      if(data[i]. _113_cause_name == "All Causes") {
        continue;
      } else {
    //set each data point to individual variable
    var num = Number(data[i].deaths);
    var name = String(data[i].cause_name);
    //push into main dataset for reuse
    dataset.push({"name": name, "value": num});
      }
    }
    chartCreate()
  });
}

//chart creation calls
function chartCreate() {
  //tracked chart creation
  if(track == 1) {
    showChart();
  } else {
    //if chart already exists remove
    d3.select("svg").remove();
    showChart();
  }
  //call reset for count 
  if(count == 5) {
    reset();
  }
  
}

//main chart creation
function showChart() {

  //append tooltips for death amounts
  var tooltip = d3.select('body').append('div')
  .attr('class', 'tooltip')
  .style('opacity', 0);

  //set data to main dataset and sort
  var data = dataset;
  data.sort((a, b) => (a.name > b.name) ? 1 : -1);

  //set the dimensions and margins of the graph
  var margin = {top: 20, right: 120, bottom: 30, left: 170},
  width = 1100 - margin.left - margin.right,
  height = 600 - margin.top - margin.bottom;

  // set the ranges for x and y
  var y = d3.scaleBand()
        .range([height, 0])
        .padding(0.1);

  var x = d3.scaleLinear()
        .range([0, width]);
        
 //append svg and group to #graphic move to left corner
  var svg = d3.select("#graphic").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", 
        "translate(" + margin.left + "," + margin.top + ")");

  //scroll window to center chart
  var h = window.innerHeight;
  window.scrollTo(0, h);

  //format data
  data.forEach(function(d) {
    d.value = +d.value;
  });

  //Scale the range of data in domains
  x.domain([0, d3.max(data, function(d){ return d.value; })])
  y.domain(data.map(function(d) { return d.name; }));

  // append the rects and mouseon and out events
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

    //set bar transitions on creation to grow out
    bar.transition()
    .duration(1000)
    .attr("width", function(d) {
      return x(d.value)
    })
  
  //append xAxis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .attr("class", "axis")
      .call(d3.axisBottom(x));

  //append yAxis
  svg.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(y));

}

//compare button to flow to map selection and create item buttons
function compare(){

  //disable compare button to prevent overuse
  document.getElementById("compButt").disabled = true; 

  //track button creation to assure no overuse
  if(buttonTrack == 0) {
    createButtons();
    buttonTrack++;
  }

  //call map for US map creation
  map();

  //scroll window to center map
  window.scrollBy(0,800);
  
}

//create map and comparison graphs onclick
function map() {

  //clear and graphics from map div
  d3.select("#graphic2").select("svg").remove().exit();
  var svg = d3.select("#graphic2").append("svg")
  .attr("width", 950)
  .attr("height", 600)

  //path creation and d3 JSON call with click event/using feature over mesh for id matching
  var path = d3.geoPath();
    d3.json("https://d3js.org/us-10m.v1.json").then(function(us) {
      svg.append("g")
        .attr("class", "states")
        .selectAll("path")
        .data(topojson.feature(us, us.objects.states).features)
        .enter()
        .append("path")
        .attr("d", path)
        //create comparison charts
        .on("mousedown", function (d) {

          //append tooltip
          var tooltip = d3.select('body').append('div')
          .attr('class', 'tooltip')
          .style('opacity', 0);

          window.setTimeout(function set(){ window.scrollBy(0, 900);}, 500);
 
          //set state for comparison equal to source of click
          state2 = states[d.id];

          //track of comparison chart creation, clears if existent
          if(track4 == 1) {
            d3.select("#d2").select("svg").remove().exit();
            track4 = 0;
            dataset3 = new Array();
          }

          //API call for second state
          $.ajax({
            url: "https://data.cdc.gov/resource/u4d7-xz8k.json?$where=year = "+year+"&state="+state2+"",
            type: "GET",
            data: {
              "$limit" : 5000,
              "$$app_token" : "KfPXeWRyFx9V5TmvRttOfIaiV"
            }
          }).done(function(data) {
            track2 = 0;
            track4++;
            //loop through pulled data excluding All Causes 
            for(var i = 0; i <= data.length -1; i++) {
              if(data[i]. _113_cause_name == "All Causes") {
                continue;
              } else {
                  var num = Number(data[i].deaths);
                  var name = String(data[i].cause_name);
                  dataset3.push({"name": name, "value": num});
              }
            }

        //console.log(dataset3);
      
        //set data and sort by name
        var data = dataset3;
        data.sort((a, b) => (a.name > b.name) ? 1 : -1);
      
        //set the dimensions and margins of the graph
        var margin = {top: 60, right: 42.5, bottom: 30, left: 9},
        width = 550,
        height = 350;
      
              //set the ranges of x and y
              var y = d3.scaleBand()
              .range([height, 0])
              .padding(0.1);

              var x = d3.scaleLinear()
                .range([0, width]);
                
             //append svg and group to #d2 move to left corner
              var svg = d3.select("#d2").append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              .append("g")
              .attr("transform", 
                "translate(" + margin.left + "," + margin.top + ")");

              //format data
              data.forEach(function(d) {
              d.value = +d.value;
              });


              //append state header
              svg.append("text")
                .attr("x", (width / 2))             
                .attr("y", 0 - (margin.top / 2))
                .attr("text-anchor", "middle")  
                .style("font-size", "30px") 
                .attr("font-family", "'Oswald', sans-serif")
                .attr("fill", "floralwhite")
                .text(state2);

              //determine how to scale to the domain based on largest max data value in order to avoid data appearing similiar when actually very different 
              if (d3.max(dataset, function(d){ return d.value; }) > d3.max(data, function(d){ return d.value; })) {
                x.domain([0, d3.max(dataset, function(d){ return d.value; })])
                y.domain(dataset.map(function(d) { return d.name; }));
              } else {
                x.domain([0, d3.max(data, function(d){ return d.value; })])
                y.domain(data.map(function(d) { return d.name; }));
              }
       
        //append rect to comparison chart with tooltip
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
  
        //chart transition for bar growth
        bar.transition()
        .duration(1000)
        .attr("width", function(d) {
        return x(d.value)
        })

        //add xAxis
        svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .attr("class", "axis")
        .call(d3.axisBottom(x));

        //add yAxis
        svg.append("g")
          .attr("class", "axis")
          .call(d3.axisLeft(y));

          //set track back
          track2 == 0;

           //load main comparison chart
     resetChart1();
        });


    });

  
    //append path for borders on map
    svg.append("path")
      .attr("class", "state-borders")
      .attr("d", path(topojson.feature(us, us.objects.states, function(a, b) { return a !== b; })))
  });
}

//update map with percantage value calculated
function updateMap() {
    //console.log(dataset);

    //track updates
    if(updatetrack == 0) {
      for(var i = 0; i <=9; i++) {

        //define the percentage and set dataset values accordingly 
        percentage[i] = Math.floor((dataset[i].value * 5)/100);
        dataset[i].value = Number(dataset[i].value - percentage[i]);
        
      }
    //console.log(percentage);
    //console.log(dataset);

    } else {

    //persist original percentage for accuracy
    for(var i = 0; i <=9; i++) {
      dataset[i].value = Number(dataset[i].value - percentage[i]);
      //console.log(dataset);
    }
  }

  //second layer update
  if(updatetrack == 0) {
    for(var i = 0; i <=9; i++) {
     
      percentage3[i] = Math.floor((dataset3[i].value * 5)/100);
      dataset3[i].value = Number(dataset3[i].value - percentage3[i]);
      
    }
    //console.log(percentage);
    //console.log(dataset);

  } else {
    for(var i = 0; i <=9; i++) {
      dataset3[i].value = Number(dataset3[i].value - percentage3[i]);
      //console.log(dataset3);
    }
  }

  //call updated graph creation
  postUp();
}

//transform graphs with updated data
function postUp() {

  var percentage2 = 0;
  //console.log(dataset);
  updatetrack++;

    //define svg width and height
    width = 550,
    height = 350;

    //set upArray back to zero, reuse
    upArray = new Array();
    upArray = dataset;
    //console.log(upArray);

    //format data
    upArray.forEach(function(d) {
      d.value = +d.value;
    });


    //define x, y and x2
    var y = d3.scaleBand()
    .range([height, 0])
    .padding(0.1);

    var x = d3.scaleLinear()
    .range([width, 0]);

    var x2 = d3.scaleLinear()
    .range([0, width]);
      
    if (d3.max(upArray, function(d){ return d.value; }) > d3.max(dataset3, function(d){ return d.value; })) {
      x.domain([d3.max(upArray, function(d){ return d.value; }), 0])
      x2.domain([d3.max(upArray, function(d){ return d.value; }), 0])
      y.domain(upArray.map(function(d) { return d.name; }));
    } else {
      x.domain([d3.max(dataset3, function(d){ return d.value; }), 0])
      x2.domain([d3.max(dataset3, function(d){ return d.value; }), 0])
      y.domain(dataset3.map(function(d) { return d.name; }));
    }

    //define bars with new data and exit
    var bars = d3.select("body").select("#d3Id").select("svg").select("g").selectAll("rect")
    .data(upArray)
    bars.exit();
                
    //create updated chart
    bars
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("y", function(d) { 
        //console.log(d);
        return y(d.name); })
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

    //transition bars to value with percentages removed
    bars.transition()
    .duration(1000)
    .attr("width", function(d) {
    
      //set width based on percentage
      if(count == 0) {
        percentage2 = (x(d.value)* 5)/100
        //console.log(x(d.value) - percentage2)
        return Math.floor(x(d.value) - percentage2) 
      } else if(count == 1) {
          percentage2 = (x(d.value)* 10)/100
          //console.log(x(d.value) - percentage2)
          return Math.floor(x(d.value) - percentage2) 
      } else if(count == 2) {
        percentage2 = (x(d.value)* 17.5)/100
        //console.log(x(d.value) - percentage2)
        return Math.floor(x(d.value) - percentage2) 
      } else if(count == 3) {
        percentage2 = (x(d.value)* 24)/100
        //console.log(x(d.value) - percentage2)
        return Math.floor(x(d.value) - percentage2) 
      } else if(count == 4) {
        percentage2 = (x(d.value)* 34)/100
       //console.log(x(d.value) - percentage2)
        return Math.floor(x(d.value) - percentage2) 
      }})
      //set x based on the items
     .attr("x", function(d) {
      if(count == 0) {
        var percentage2 = (x(d.value)* 5)/100
        return Math.floor(width-x(d.value) + percentage2)
      } else if(count == 1) {
        var percentage2 = (x(d.value)* 10)/100
        return Math.floor(width-x(d.value) + percentage2)
      } else if(count == 2) {
        var percentage2 = (x(d.value) * 17.5)/100
        return Math.floor(width-x(d.value) + percentage2)
      } else if(count == 3) {
        var percentage2 = (x(d.value) * 24)/100
        return Math.floor(width-x(d.value) + percentage2)
      } else if(count == 4) {
        var percentage2 = (x(d.value)* 34)/100
        return Math.floor(width-x(d.value) + percentage2)
      }});

     //set second update array
      upArray2 = new Array();
      upArray2 = dataset3;
      //console.log(upArray2);
    
        
      //format data
      upArray2.forEach(function(d) {
        d.value = +d.value;
      });
    
      //define x, y and x2
        var y = d3.scaleBand()
        .range([height, 0])
        .padding(0.1);
    
        var x = d3.scaleLinear()
          .range([width, 0]);
    
        var x2 = d3.scaleLinear()
          .range([width, 0]);
      
    //scale range on domains
    if (d3.max(dataset, function(d){ return d.value; }) > d3.max(upArray2, function(d){ return d.value; })) {
      x.domain([d3.max(dataset, function(d){ return d.value; }), 0])
      x2.domain([0, d3.max(dataset, function(d){ return d.value; })])
      y.domain(dataset.map(function(d) { return d.name; }));
    } else {
      x.domain([d3.max(upArray2, function(d){ return d.value; }), 0])
      x2.domain([0, d3.max(upArray2, function(d){ return d.value; })])
      y.domain(upArray2.map(function(d) { return d.name; }));
    }
    
      //set bars and clear area
      var bars = d3.select("body").select("#d2").select("svg").select("g").selectAll("rect")
      .data(upArray2)
      bars.exit();
                    
      bars
          .enter()
          .append("rect")
          .attr("class", "bar")
          .attr("x", 0)
          .attr("y", function(d) {return y(d.name); })
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
    
        bars.transition()
        .duration(1000)
        .attr("width", function(d) {
          //console.log(d);
          if(count == 0) {
          percentage2 = (x(d.value)* 5)/100
          //console.log(x(d.value) - percentage2)
          return Math.floor(x(d.value) - percentage2) 
          } else if(count == 1) {
            percentage2 = (x(d.value)* 10)/100
          //console.log(x(d.value) - percentage2)
          return Math.floor(x(d.value) - percentage2) 
          }  else if(count == 2) {
            percentage2 = (x(d.value)* 17.5)/100
          //console.log(x(d.value) - percentage2)
          return Math.floor(x(d.value) - percentage2) 
          }  else if(count == 3) {
            percentage2 = (x(d.value)* 24)/100
          //console.log(x(d.value) - percentage2)
          return Math.floor(x(d.value) - percentage2) 
          }  else if(count == 4) {
            percentage2 = (x(d.value)* 34)/100
          //console.log(x(d.value) - percentage2)
          return Math.floor(x(d.value) - percentage2) 
          }}) 
      
      //increment count for button presses
      count++;

      //disable button used for call
      document.getElementById(event.srcElement.id).disabled = true; 

      //append final conclusion when completely looped and visualized
      if(count == 5 && cp == 0) {
        d3.select(".finalInfo").append("span")
        .attr("class", "conclusion")
        .text("Lifestyle changes like avoiding tobacco, increasing physical activity, and eating healthier could significantly reduce deaths in the United States according to the CDC. These visualizations represents data from the CDC itself and articles published by the CDC that provide the leading causes of death in the U.S. Percentages by which these cuases would be decreased by limiting the given factors were also provided by the CDC. By limiting these it is estimated that a total of 260,000 lives could be prolonged and possibly a portion of them spared of the diseases to begin with. Click Reset to see statistics for a different origin state or year or click Compare to select a new comparison state from the map.")
        cp++;
      }

      //scroll window for conclusion
      if(count == 5) {
        window.scrollBy(0, 200);
      }
  }

//create item buttons for percentage manipulation
function createButtons() {

  //conclusion
  d3.select(".info").append("h2")
  .text("Click on each item to see how limiting these impacts the data!")

  //item buttons
  d3.select(".takeoff").append("button")
  .attr("class", "btn btn-outline-secondary")
  .attr("id", "tobacco")
  .attr("type", "button")
  .attr("onclick", "updateMap()")
  .text("Tobacco");

  d3.select(".takeoff").append("button")
  .attr("class", "btn btn-outline-secondary")
  .attr("id", "healthy")
  .attr("type", "button")
  .attr("onclick", "updateMap()")
  .text("Unhealthy Food");

  d3.select(".takeoff").append("button")
  .attr("class", "btn btn-outline-secondary")
  .attr("id", "exercise")
  .attr("type", "button")
  .attr("onclick", "updateMap()")
  .text("Unhealthy Lifestyle");

  d3.select(".takeoff").append("button")
  .attr("class", "btn btn-outline-secondary")
  .attr("id", "sun")
  .attr("type", "button")
  .attr("onclick", "updateMap()")
  .text("Sun/UV Rays");

  d3.select(".takeoff").append("button")
  .attr("class", "btn btn-outline-secondary")
  .attr("id", "alcohol")
  .attr("type", "button")
  .attr("onclick", "updateMap()")
  .text("Alcohol");

  d3.select(".takeoff2").append("button")
  .attr("class", "btn btn-outline-secondary")
  .attr("type", "button")
  .attr("onclick", "totalReset()")
  .text("Reset");

  d3.select(".takeoff2").append("button")
  .attr("class", "btn btn-outline-secondary")
  .attr("type", "button")
  .attr("onclick", "newComp()")
  .text("Compare");

  }

  //reset chart
  function reset() {
  
        if(track4 == 1) {
          d3.select("#d2").select("svg").remove().exit();
          track4 = 0;
          dataset3 = new Array();
        }

        //call API 
        $.ajax({
          url: "https://data.cdc.gov/resource/u4d7-xz8k.json?$where=year = "+year+"&state="+state2+"",
          type: "GET",
          data: {
            "$limit" : 5000,
            "$$app_token" : "KfPXeWRyFx9V5TmvRttOfIaiV"
          }
        }).done(function(data) {
        
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

        //sort the data
        var data = dataset3;
        data.sort((a, b) => (a.name > b.name) ? 1 : -1);
      
        //set the dimensions and margins of the graph
        var margin = {top: 60, right: 42.5, bottom: 30, left: 9},
        width = 550,
        height = 350;
      
              // set the ranges of x and y
              var y = d3.scaleBand()
              .range([height, 0])
              .padding(0.1);

              var x = d3.scaleLinear()
                .range([0, width]);
                
              //append svg rects andmove to top left
              var svg = d3.select("#d2").append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              .append("g")
              .attr("transform", 
                "translate(" + margin.left + "," + margin.top + ")");

              //format data
                data.forEach(function(d) {
                d.value = +d.value;
              });

              //add header for state
              svg.append("text")
                .attr("x", (width / 2))             
                .attr("y", 0 - (margin.top / 2))
                .attr("text-anchor", "middle")  
                .style("font-size", "30px") 
                .attr("font-family", "'Oswald', sans-serif")
                .attr("fill", "floralwhite")
                .text(state2);

              //determine x and y domains
              if (d3.max(dataset, function(d){ return d.value; }) > d3.max(data, function(d){ return d.value; })) {
                x.domain([0, d3.max(dataset, function(d){ return d.value; })])
                y.domain(dataset.map(function(d) { return d.name; }));
              } else {
                x.domain([0, d3.max(data, function(d){ return d.value; })])
                y.domain(data.map(function(d) { return d.name; }));
              }
       
        //append rects and tooltip
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
  
        //grow transition
        bar.transition()
        .duration(1000)
        .attr("width", function(d) {
          //console.log("hello")
          return x(d.value)
        })

        //add xAxis
        svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .attr("class", "axis")
        .call(d3.axisBottom(x));

        //add yAxis
        svg.append("g")
          .attr("class", "axis")
          .call(d3.axisLeft(y));
      });
  }

  //reset/create comparison chart 1
  function resetChart1() {

    var data3 = dataset3;
    data3.sort((a, b) => (a.name > b.name) ? 1 : -1);
    //console.log(data3);

    dataset2 = new Array();

    if(track3 == 1) {
      d3.select("#d3Id").select("svg").remove().exit();
      //console.log(track3),
      track3 = 0;
    }

      var tooltip = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);
   
        //set data and sort
        var data = dataset;
        data.sort((a, b) => (a.name > b.name) ? 1 : -1);

        //remove and existing svg in #d3Id
        d3.select("#d3Id").select("svg").remove().exit();


        //set the dimensions and margins of the graph
        var margin = {top: 60, right: 165, bottom: 30, left: 42.5},
        width = 550,
        height = 350;
    
            //set ranges for x and y
            var y = d3.scaleBand()
            .range([height, 0])
            .padding(0.1);

            var x = d3.scaleLinear()
              .range([width, 0]);

            var x2 = d3.scaleLinear()
            .range([0, width]);
              
      
            //append svg in #d3Id 
            var svg = d3.select("#d3Id").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", 
              "translate(" + margin.left + "," + margin.top + ")");

            //format data
            data.forEach(function(d) {
            d.value = +d.value;
            });

            //append header
            svg.append("text")
            .attr("x", (width / 2))             
            .attr("y", 0 - (margin.top / 2))
            .attr("text-anchor", "middle")  
            .style("font-size", "30px") 
            .attr("font-family", "'Oswald', sans-serif")
            .attr("fill", "floralwhite")
            .text(state);

            if (d3.max(data, function(d){ return d.value; }) > d3.max(data3, function(d){ return d.value; })) {
              x.domain([d3.max(data, function(d){ return d.value; }), 0])
              x2.domain([d3.max(data, function(d){ return d.value; }), 0])
              y.domain(data.map(function(d) { return d.name; }));
            } else {
              x.domain([d3.max(data3, function(d){ return d.value; }), 0])
              x2.domain([d3.max(data3, function(d){ return d.value; }), 0])
              y.domain(data3.map(function(d) { return d.name; }));
            }

      

      //append rects and tooltips
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

      //growth transition
      bar.transition()
      .duration(1000)
      .attr("width", function(d) {
        //console.log(x(d.value))
        return x(d.value)
      })

      //add xAxis
      svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .attr("class", "axis")
      .call(d3.axisBottom(x2));

      //add yAxis
      svg.append("g")
      .attr("class", "axis")
      .attr('transform', 'translate(' + (550) + ', 0)')
      .call(d3.axisRight(y));
  

    //renable buttons and reset count for new updates
    document.getElementById("tobacco").disabled = false;
    document.getElementById("exercise").disabled = false; 
    document.getElementById("alcohol").disabled = false;
    document.getElementById("sun").disabled = false;
    document.getElementById("healthy").disabled = false;
    count = 0;
    updatetrack = 0;
}

  //total reset and move to choose new main state or year
  function totalReset() {
    window.scrollBy(0, -1725);
    reset();
    resetChart1();
    //renable comaprison button
    document.getElementById("compButt").disabled = false; 
  }

  //scroll back up to map 
  function newComp() {
    window.scrollBy(0, -900);
  }


  
    




