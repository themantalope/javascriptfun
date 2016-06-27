/**
 * This class loads and parses JSON files for multilayer network. The JSON files should be of form:
 * {nodes:[list of nodes], networks:[list of adjacency matricies]}
 * At a minimum, each node data packet must contain an "index" variable, which is an integer that describes the row/col
 * location associated with that node in the adjacency matricies. An example of a node data packet would look like this:
 * {"index":1, "label":"some label", "interesting dictionary":{}}. For the networks variable, each network should be an
 * array of arrays, with 1 and 0 representing a link and the absence of a link between the ith and jth nodes, respectiv-
 * ely (recalling that the ith node would have its "index" value equal to i, as would be the case for the jth node).
 * This object will then return a MultiGraph object, which will have the features available to slice and dice the
 * networks as desired!
 */

import MultiGraph from "MultiGraph";

let _multiGraph = new WeakMap();

export class MultiGraphJSONLoader {

    /*
    * This class loads and creates a MultiGraph object to use after parsing a JSON file.
    * @param {fname} - the name of the json file with the network data
    * */
    
    constructor(fname){

        var loaddata = this._loadJSON(fname);

        mg = new MultiGraph(loaddata.nodes, loaddata.matricies);
        _multiGraph.bind(this, mg);
        return mg;

    }

    _loadJSON(fname){
        var nodes, matricies;

        d3.json(fname, function(json){

            if (!("nodes" in json)) {
                throw "JSON file must have a 'nodes' list!"
            } else {
                nodes = json.nodes;
            }

            if (!("matricies" in json)){
                throw "JSON file must have a 'matricies' list!"
            } else {
                matricies = json.matricies;
            }

        });

        return {"nodes":nodes, "matricies":matricies};
    }

    getMultiGraph(){
        return _multiGraph.get(this);
    }


}

module.export = MultiGraphJSONLoader;