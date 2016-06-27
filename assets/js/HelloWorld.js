/**
 * Created by antalek on 6/22/16.
 */
// create the SVG container

$(document).load(function () {
    var svg = d3.select("#helloWorldCanvas")
        .append("svg")
        .attr("width", 500)
        .attr("height", 300);

// add the text that we want to display
    svg.append("text")
        .attr("x", 150).attr("y", 200)
        .attr("fill", "red")
        .attr("font-size", "25px").attr("font-family", "sans-serif")
        .text("Hello World!");

// now let's add a circle to accompany the text
    svg.append("circle")
        .style("fill", "#27aae1")
        .attr("cx", 100).attr("cy", 50)
        .attr("r", 15);
});
