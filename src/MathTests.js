
"use strict";
import {MultiGraphJSONLoader} from "./MultiGraphJSONLoader";
/**
 * Created by antalek on 6/23/16.
 */


var a = [[1,2,3],[4,5,6]];
console.log(a);
console.log(a.length);
console.log(a[0].length);
console.log(a[0][2]);
console.log(a.something);
console.log("something" in a);

var x,y = [10,11];

console.log("x is : ", x);
console.log("y is: ", y);

var b = {"index":10, "something interesting":"not much to see here."};
console.log("index" in b);
console.log("b.index", b.index);
console.log("b[index] ", b["index"]);


var d = {"something":""};
console.log("this is d: ",d);

var ns;

var filename = "assets/data/d1_d2_networks.json";

d3.json(filename, function(json){
    ns=json.nodes;
});


var gl = new MultiGraphJSONLoader(filename);